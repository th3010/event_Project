const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

// Import Models
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Đã kết nối MongoDB Compass!'))
  .catch((err) => console.log('❌ Lỗi kết nối:', err));

// ================= API SỰ KIỆN =================
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find(); 
        res.status(200).json(events);
    } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id); 
        if (!event) return res.status(404).json({ error: 'Không tìm thấy' });
        res.status(200).json(event);
    } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

app.get('/api/events-related/:currentId', async (req, res) => {
    try {
        const related = await Event.find({ _id: { $ne: req.params.currentId } }).limit(3);
        res.json(related);
    } catch (err) { res.status(500).json({ message: 'Lỗi server' }); }
});

app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            date: req.body.date,
            location: req.body.location,
            imageUrl: req.body.imageUrl,
            category: req.body.category,
            price: req.body.price, // Lấy giá tiền
            createdBy: req.body.createdBy, // Lấy ID người tạo
            organizerName: req.body.organizerName || "EventHub User" 
        });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) { res.status(500).json({ error: 'Lỗi khi tạo sự kiện' }); }
});

app.get('/api/events/organizer/:userId', async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.params.userId });
        res.status(200).json(events);
    } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

app.put('/api/events/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedEvent);
    } catch (err) { res.status(500).json({ error: 'Lỗi cập nhật' }); }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xóa' });
    } catch (err) { res.status(500).json({ error: 'Lỗi khi xóa' }); }
});

// ================= API BOOKING =================
app.post('/api/bookings', async (req, res) => {
    try {
        const { userId, eventId, tickets } = req.body;
        const newBooking = new Booking({ user: userId, event: eventId, tickets: tickets || 1 });
        await newBooking.save(); 
        res.status(201).json({ message: 'Đặt vé thành công!', booking: newBooking });
    } catch (err) { res.status(500).json({ error: 'Lỗi đặt vé' }); }
});

app.get('/api/bookings/my-tickets/:userId', async (req, res) => {
    try {
        const tickets = await Booking.find({ user: req.params.userId }).populate('event');
        res.status(200).json(tickets);
    } catch (err) { res.status(500).json({ error: 'Lỗi lấy vé' }); }
});

// ================= API AUTH =================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) { res.status(500).json({ error: 'Lỗi đăng ký' }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Email không tồn tại' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Sai mật khẩu' });
        const token = jwt.sign({ id: user._id }, "SECRET_KEY_CUA_THU", { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) { res.status(500).json({ error: 'Lỗi đăng nhập' }); }
});

// 1. Khai báo nơi lưu trữ Sự kiện yêu thích (Wishlist)
const savedEventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
}, { timestamps: true });
const SavedEvent = mongoose.model('SavedEvent', savedEventSchema);

// 2. API Cập nhật Profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, password } = req.body;
        const updateData = { name };
        // Nếu người dùng có nhập pass mới thì mới đổi pass
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
    } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

// 3. API Lưu / Bỏ lưu sự kiện (Thêm vào Giỏ hàng)
app.post('/api/saved-events', async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        const existing = await SavedEvent.findOne({ user: userId, event: eventId });
        if (existing) {
            await SavedEvent.findByIdAndDelete(existing._id);
            res.json({ isSaved: false }); // Đã bỏ lưu
        } else {
            await new SavedEvent({ user: userId, event: eventId }).save();
            res.json({ isSaved: true }); // Đã lưu
        }
    } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

// 4. API Kiểm tra trạng thái nút Trái tim
app.get('/api/saved-events/check/:userId/:eventId', async (req, res) => {
    try {
        const existing = await SavedEvent.findOne({ user: req.params.userId, event: req.params.eventId });
        res.json({ isSaved: !!existing });
    } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

// 5. API Lấy toàn bộ sự kiện đã lưu của 1 User
app.get('/api/saved-events/:userId', async (req, res) => {
    try {
        const saved = await SavedEvent.find({ user: req.params.userId }).populate('event');
        res.json(saved);
    } catch (err) { res.status(500).json({ error: 'Lỗi server' }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại cổng ${PORT}`));