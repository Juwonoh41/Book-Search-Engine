const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query:{
        me:async(parent, args, context)=>{
          if (context.user) {
            const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
            return userData;
          }
          throw new AuthenticationError('Login first');
        },
      },

      Mutation:{
        saveBook: async(parent,{ bookData },context) => {
            if (context.user){
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: bookData } },
                { new: true }
              );
              return updatedUser;
            }
            throw new AuthenticationError('Login first');
          },
          removeBook: async(parent,{ bookId },context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
              return updatedUser;
            }
            throw new AuthenticationError('Login first');
          },

      }
}