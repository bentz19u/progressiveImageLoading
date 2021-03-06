var bcrypt = require("bcrypt");
var jwtUtils = require('../utils/jwt.utils')
var redis = require('redis');
var axios = require('axios');
var client = redis.createClient();
var async = require('async');
// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
//Routes
module.exports = {
    verifyapikey: function (req, res) {
        console.log("verifyapikey function");
        var headerAuth = req.headers['authorization'];
        var token = jwtUtils.parseAuthorization(headerAuth);
        client.lrem("apikey", 1, token, function (err, result) {
            if (result) {
                client.lpush("apikey", token);
                let info = { 'api_key': token, 'upload_preset': 'wimsusxm', 'cloudName': 'morgandbs' }
                return res.status(200).json(info);
            } else {
                return res.status(404).json({ 'error': 'apikey not found' });
            }
        });
    },
    delete: function (req, res) {
        console.log("delete function");
        var headerAuth = req.headers['sessiontoken'];
        var username = jwtUtils.getUserId(headerAuth);
        console.log("username:" + username);
        if (username == -1) {
            return res.status(400).json({ 'error': 'wrong token' });
        }
        client.hgetall(username, function (error, result) {
            if (result) {
                if (result.sessiontoken == jwtUtils.parseAuthorization(headerAuth)) {
                    console.log("apikey:" + result.token);
                    client.llen(result.token,function(err,resul){
                        if(resul>0){
                            console.log("on a bien une longueur");
                            client.lrange(result.token,0,resul,function(e,re){
                                if(re){
                                    console.log("juste avant l'appel asyncrone")
                                    async.each(re, function (item, callback) {
                                        console.log("on est dans le each")
                                        client.hget(item,"name",function(err,resultat){
                                            if(resultat){
                                                console.log("truc cloudinary");
                                                cloudinary.v2.uploader.destroy(resultat);
                                            }
                                        });
                                        client.del(item, function (err, resultat) {
                                            if(resultat){
                                                console.log("on arrive a callback");
                                                callback();
                                            }else{
                                                return res.status(500).json({"error":"one image delation error"});
                                            }      
                                        })
    
                                    });
                                }
                            });
                        }
                    });
                    client.del(result.token,function(e,r){
                        if(e){
                            return res.status(500).json({"error":"imageid list delation error"});
                        }
                    });
                    client.lrem("apikey", 1, result.token,function(e,r){
                        if(e){
                            return res.status(500).json({"error":"delation from apikey tab error"});
                        }
                    });
                    client.del(username, function (err, resultat) {
                        if (resultat) {
                            return res.status(200).json({ 'msg': 'account delete' });
                        }
                    });

                } else {
                    return res.status(400).json({ 'error': 'this token is a previous version' });
                }
            } else {
                return res.status(404).json({ "error": "user not exist in DB" });
            }
        });
    },
    register: function (req, res) {
        console.log("register function");
        //Params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var sessiontoken = "null";
        console.log("try to register with email:" + email + " username:" + username + " and password:" + password);
        if (email == null || username == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
        }
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (must length > 8 and 1 maj, 1min , 1 number,1 special char )' });
        }

        client.hgetall(username, function (error, result) {
            if (result) {
                return res.status(409).json({ 'error': 'user with that username already exist' });
            } else {
                bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                    var token = jwtUtils.generateToken(username);

                    client.hmset(username, [
                        'email', email,
                        'password', bcryptedPassword,
                        'token', token,
                        'sessiontoken', sessiontoken
                    ], function (err, reply) {
                        if (err) {
                            return res.status(500).json({ 'error': 'cannot add user' });
                        }
                        if (client.exists("apikey")) {
                            client.lpush("apikey", token);
                        } else {
                            client.lset("apikey", token);
                        }
                        return res.status(201).json({ 'username': username, 'apikey': token });
                    });
                });

            }
        });
    },
    login: function (req, res) {
        console.log("login function");
        var username = req.body.username;
        var password = req.body.password;
        console.log("try to login with username:" + username + " and password:" + password);
        if (username == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        client.hgetall(username, function (error, result) {
            if (result) {
                bcrypt.compare(password, result.password, function (errBcrypt, resBcrypt) {
                    if (resBcrypt) {
                        var sessiontoken = jwtUtils.generateTokenForUser(username);
                        client.hset(username, 'sessiontoken', sessiontoken);
                        return res.status(200).json({ 'username': result.username, 'sessiontoken': sessiontoken, 'apikey': result.token });
                    } else {
                        return res.status(403).json({ 'error': 'invalid password' });
                    }
                });
            } else {
                return res.status(404).json({ 'error': 'user not exist in DB or not connected ' });
            }
        });
    },

    logout: function (req, res) {
        console.log("logout function");
        var headerAuth = req.headers['sessiontoken'];
        var username = jwtUtils.getUserId(headerAuth);
        console.log("this user try to logout:" + username);
        if (username == -1) {
            return res.status(400).json({ 'error': 'wrong token' });
        }
        client.hgetall(username, function (error, result) {
            if (result) {
                if (result.sessiontoken == jwtUtils.parseAuthorization(headerAuth)) {
                    client.hset(username, 'sessiontoken', "null", function (err, result) {
                        if (result) {

                        } else {
                            return res.status(200).json({ 'ok': 'token is kill', 'token': result.sessiontoken });
                        }
                    });

                } else {
                    return res.status(400).json({ 'error': 'this token is a previous version' });
                }
            } else {
                return res.status(404).json({ "error": "user not exist in DB" });
            }
        });
    },

    profile: function (req, res) {
        console.log("profile function");
        var headerAuth = req.headers['sessiontoken'];
        var username = jwtUtils.getUserId(headerAuth);
        console.log("username:" + username);
        if (username == -1) {
            return res.status(400).json({ 'error': 'wrong token' });
        }
        client.hgetall(username, function (error, result) {
            if (result) {
                if (result.sessiontoken == "null") {
                    return res.status(402).json({ "error": "need to be log in" });
                }
                if (result.sessiontoken == jwtUtils.parseAuthorization(headerAuth)) {
                    return res.status(200).json({ 'username': result.username, 'password': result.password, 'email': result.email, 'apikey': result.token })
                } else {
                    return res.status(400).json({ 'error': 'this token is a previous version' });
                }
            } else {
                return res.status(404).json({ "error": "user not exist in DB" });
            }
        });
    },

    changemail: function (req, res) {
        console.log("changemail function");
        var headerAuth = req.headers['sessiontoken'];
        var username = jwtUtils.getUserId(headerAuth);
        var email = req.body.email;
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
        }
        if (username == -1) {
            return res.status(400).json({ 'error': 'wrong token' });
        }
        client.hgetall(username, function (error, result) {
            if (result) {
                if (result.sessiontoken == jwtUtils.parseAuthorization(headerAuth)) {
                    client.hset(username, 'email', email, function (err, resultat) {
                        if (resultat) {

                        } else {
                            return res.status(200).json({ 'username': username });
                        }
                    });
                } else {
                    return res.status(400).json({ 'error': 'this token is a previous version' });
                }
            } else {
                return res.status(404).json({ "error": "user not exist in DB" });
            }
        });
    },

    changepassword: function (req, res) {
        console.log("changepassword function");
        var headerAuth = req.headers['sessiontoken'];
        var username = jwtUtils.getUserId(headerAuth);
        var password = req.body.password;
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (must length > 8 and 1 maj, 1min , 1 number,1 special char )' });
        }
        if (username == -1) {
            return res.status(400).json({ 'error': 'wrong token' });
        }
        client.hgetall(username, function (error, result) {
            if (result) {
                if (result.sessiontoken == jwtUtils.parseAuthorization(headerAuth)) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        client.hset(username, 'password', bcryptedPassword, function (err, resultat) {
                            if (resultat) {
                            } else {
                                return res.status(200).json({ 'username': username });
                            }
                        });
                    });

                } else {
                    return res.status(400).json({ 'error': 'this token is a previous version' });
                }
            } else {
                return res.status(404).json({ "error": "user not exist in DB" });
            }
        });
    },
    changeusername: function (req, res) {
        console.log("changeusername function ! this function change the user session token");
        var headerAuth = req.headers['sessiontoken'];
        var username = jwtUtils.getUserId(headerAuth);
        var usernamenew = req.body.username;
        console.log("the new username:" + usernamenew);
        if (usernamenew.length >= 13 || usernamenew.length <= 4) {
            return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
        }
        if (username == -1) {
            return res.status(400).json({ 'error': 'wrong token' });
        }
        client.hgetall(username, function (error, result) {
            if (result) {
                if (result.sessiontoken == jwtUtils.parseAuthorization(headerAuth)) {
                    client.renamenx(username, usernamenew, function (e, r) {
                        if (r) {
                            var sessiontoken = jwtUtils.generateTokenForUser(usernamenew);
                            client.hset(usernamenew, 'sessiontoken', sessiontoken);
                            res.status(200).json({ "sessiontoken": sessiontoken });
                        }
                        if (e) {
                            res.status(403).json({ "error": "acccount with this username already exist" });
                        }
                    });

                } else {
                    return res.status(400).json({ 'error': 'this token is a previous version' });
                }
            } else {
                return res.status(404).json({ "error": "user not exist in DB" });
            }
        });
    }
}