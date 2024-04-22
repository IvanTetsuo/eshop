const User = require('../models/User');

class UserController {
    async getUser(req, res) {
        try {
            const {userId} = req;
            const user = await User.findById(userId).populate('articles');
            res.json({user});
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'woops'});
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({message: 'woops'});
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'not found'});
            }
            const {firstName, lastName} = req.body;
            if (firstName) {
                user.firstName = firstName;
            }
            if (lastName) {
                user.lastName = lastName;
            }
            await user.save();
            res.json({updatedUser: user});
        } catch(err) {
            console.log(err);
            res.status(400).json({message: 'woops'});
        }
    }
}

module.exports = new UserController();