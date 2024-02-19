const orgModel = require('./organization.model')

const orgRegistration = async (userBody, res) => {
	const user = await orgModel.create(userBody);
	return user;
};


module.exports={
    orgRegistration
}