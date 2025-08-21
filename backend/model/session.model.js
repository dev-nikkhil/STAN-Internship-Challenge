import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const sessionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'New Chat'
    },
    summary: {
        type: String,
        default: ''
    },
    history: [
        {
            role: {
                type: String,
                enum: ['user', 'assistant', 'system'],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            metadata: {
                extractedFacts: [{
                    key: String,
                    value: Schema.Types.Mixed
                }],
                tags: [String]
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    userFacts: {
        name: { type: String, default: '' },
        preferences: [{
            key: String,
            value: String
        }],
        mood: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-update updatedAt on save
sessionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Session = model('Session', sessionSchema);
export default Session;