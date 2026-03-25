const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
    category: { type: String, default: "Music" },
    
    // 2 TRƯỜNG VỪA THÊM ĐỂ FIX LỖI:
    price: { type: Number, default: 0 }, // Giá tiền (0 là Free)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Khóa sự kiện theo người tạo
    
    description: { type: String, default: "" },
    organizerName: { type: String, default: "EventHub Team" },
    organizerFollowers: { type: Number, default: 0 },
    highlights: [{ type: String }],
    agenda: [{ time: String, title: String }],
    faqs: [{ question: String, answer: String }]
}, { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);