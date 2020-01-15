const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    uri: { type: String, required: true },
    method: { type: String, required: true }
}, { _id: false })


const schema = new Schema({
    /* basicos */
    user_uuid: String,
    email: { type: String, index: true, lowercase: true },
    password: { type: String, select: false },
    policy_acepted: { type: Boolean },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },

    /* automaticos */
    token_reset_password: { type: String, default: null, select: false },
    token_validation: { type: String, default: null, select: false },
    account_validated: { type: Boolean, default: false },
    first_login: { type: Boolean, default: true },
    permissions: [permissionSchema],

    locked: { type: Boolean, default: false },            // cuenta bloqueada
    locked_reason: { type: String },
    deleted: { type: Boolean, default: false },           // cuanta eliminada
    deleted_date: Date,
    deleted_reason: { type: String },
}, { timestamps: true });

schema.statics.checkEmail = async function (email) {
    var data = await this.findOne({ email: email, deleted: false })
    if (data) {
        return Promise.reject(new Error('EMAIL_ALREADY_REGISTERED'))
    } else {
        return Promise.resolve()
    }
}

module.exports = mongoose.model('User', schema, 'users');