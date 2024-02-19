const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const User = require('../modules/user/user.model');
const mongoose = require('mongoose');
const { getAccessModulesFn, getAllAccessModulesForSuAdmin } = require('../modules/auth/auth.service');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findOne({_id:mongoose.Types.ObjectId(payload.sub),inActive:false});
    if (!user) {
      return done(null, false);
    }

    try {
      /* Access Modules */
      if(user.role === 'superAdmin') {
        const {accessModules} = await getAllAccessModulesForSuAdmin()
        user.accessModules = accessModules
      } else {
        const {accessModules} = await getAccessModulesFn(user.roleId)
        user.accessModules = accessModules
        
      }
    } catch (error) {
      console.error("jwtVerify access module ::", error);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
