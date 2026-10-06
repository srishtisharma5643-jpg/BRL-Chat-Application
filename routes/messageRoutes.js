const express = require("express");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// SEND MESSAGE
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { conversationId, content } = req.body;

        if (!conversationId || !content) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID and message are required"
            });
        }

        // Check whether user belongs to this conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: req.user.userId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant in this conversation"
            });
        }

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user.userId,
            content
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

// GET PREVIOUS MESSAGES
router.get("/:conversationId", authMiddleware, async (req, res) => {
    try {
        // Check whether user belongs to this conversation
        const conversation = await Conversation.findOne({
            _id: req.params.conversationId,
            participants: req.user.userId
        });

        if (!conversation) {
            return res.status(403).json({
                success: false,
                message: "You are not a participant in this conversation"
            });
        }

        const messages = await Message.find({
            conversation: req.params.conversationId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;