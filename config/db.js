const config = {
    "dev":{
        "host":"localhost",
        "database":"mongodb://OTGDeveloper:Dev113!@ds145981.mlab.com:45981/otg-development"
    },
    "production":{
        "host":"https://otg-delivery.herokuapp.com",
        "database":"mongodb://OTGDeveloper:Dev113!@ds153705.mlab.com:53705/otg-production"
    }
};
module.exports = config;
