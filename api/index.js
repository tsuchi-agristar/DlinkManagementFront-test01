require('dotenv').config();
import { CONST } from '../const.js';
import _ from 'lodash';
import dayjs from 'dayjs';
const uuidv4 = require('uuid/v4');
const express = require("express");
const app = express();

app.use(express.json())
app.use(express.urlencoded({
	extended: true
}));

const logger = require("../server/logger").logger;
const axiosBase = require("../server/axios").axiosBase;
const axios = require("../server/axios").axios;

app.use(function (req, res, next) {
	logger.debug('[Express] START TIME:', Date.now());
	logger.debug("[Express] METHOD: ", req.method, "URL: ", req.url);
	next()
});

app.get("/profile", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.session.passport.user.organization_id}`),
		axios.get(`/organization/${req.session.passport.user.organization_id}/user`)
	]).then(axiosBase.spread((res1, res3) => {
		let resData = {
			organization_id: _.get(res1, 'data.organization_id'),
			organization_name: _.get(res1, 'data.organization_name'),
			organization_name_kana: _.get(res1, 'data.organization_name_kana'),
			prefecture: _.get(res1, 'data.prefecture'),
			city: _.get(res1, 'data.city'),
			address: _.get(res1, 'data.address'),
			mail_address: _.get(res3, 'data.mail_address'),
			homepage: _.get(res1, 'data.homepage'),
			user_id: _.get(res3, 'data.user_id'),
		};
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.put("/profile", function (req, res, next) {
	let organization = {
		"organization_name": req.body.organization_name,
		"organization_name_kana": req.body.organization_name_kana,
		"prefecture": req.body.prefecture,
		"city": req.body.city,
		"address": req.body.address,
		"homepage": req.body.homepage,
	};
	let user = {
		"user_id": req.body.user_id,
		"organization_id": req.body.organization_id,
		"mail_address": req.body.mail_address,
	};
	axiosBase.all([
		axios.put(`/organization/${req.body.organization_id}`, _.omitBy(organization, _.isNil)),
		axios.put(`/user/${req.body.user_id}`, _.omitBy(user, _.isNil))
	]).then(axiosBase.spread((res1, res3) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/profile/password", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.session.passport.user.organization_id}/user`)
	]).then(axiosBase.spread((res1) => {
		let resData = _.get(res1, 'data.password');
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.put("/profile/password", function (req, res, next) {
	let user = {
		"user_id": req.session.passport.user.user_id,
		"password": req.body.password,
	};
	axiosBase.all([
		axios.put(`/user/${req.session.passport.user.user_id}`, _.omitBy(user, _.isNil))
	]).then(axiosBase.spread((res1) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/school", function (req, res, next) {

	axios.get(`/school`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				organization_name_kana: data.organization_name_kana,
				address: data.prefecture + data.city,
				mail_address: _.get(data, 'user.mail_address'),
				homepage: data.homepage,
				school_type: _.get(data, 'school.school_type'),
				student_number: _.get(data, 'school.student_number'),
				scholarship_request: _.get(data, 'school.scholarship_request'),
				internship_request: _.get(data, 'school.internship_request'),
				practice_request: _.get(data, 'school.practice_request'),
				updated_at: (data.updated_at > _.get(data, 'school.updated_at')) ? data.updated_at : _.get(data, 'school.updated_at')
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/school/:id", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.params.id}`),
		axios.get(`/school/${req.params.id}`),
		axios.get(`/organization/${req.params.id}/user`)
	]).then(axiosBase.spread((res1, res2, res3) => {
		let resData = {
			organization_id: _.get(res1, 'data.organization_id'),
			organization_name: _.get(res1, 'data.organization_name'),
			organization_name_kana: _.get(res1, 'data.organization_name_kana'),
			prefecture: _.get(res1, 'data.prefecture'),
			city: _.get(res1, 'data.city'),
			address: _.get(res1, 'data.address'),
			full_address: _.get(res1, 'data.prefecture') + _.get(res1, 'data.city') + _.get(res1, 'data.address'),
			mail_address: _.get(res3, 'data.mail_address'),
			homepage: _.get(res1, 'data.homepage'),
			school_id: _.get(res2, 'data.school_id'),
			school_type: _.get(res2, 'data.school_type'),
			student_number: _.get(res2, 'data.student_number'),
			scholarship_request: _.get(res2, 'data.scholarship_request'),
			internship_request: _.get(res2, 'data.internship_request'),
			practice_request: _.get(res2, 'data.practice_request'),
			user_id: _.get(res3, 'data.user_id'),
			account_name: _.get(res3, 'data.account_name'),
			password: _.get(res3, 'data.password'),
			dummy: _.get(res1, 'data.dummy') === '0' ? false : true,
		};
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.post("/school", function (req, res, next) {
	const uuid = uuidv4();
	let school = {
		organization: {
			"organization_id": uuid,
			"organization_type": CONST.organization_type.SCHOOL.value,
			"organization_name": req.body.organization_name,
			"organization_name_kana": req.body.organization_name_kana,
			"prefecture": req.body.prefecture,
			"city": req.body.city,
			"address": req.body.address,
			"homepage": req.body.homepage,
			"dummy": req.body.dummy,
		},
		organization_sub: {
			"school_id": uuid,
			"school_type": req.body.school_type,
			"student_number": req.body.student_number,
			"scholarship_request": req.body.scholarship_request,
			"internship_request": req.body.internship_request,
			"practice_request": req.body.practice_request
		},
		user: {
			"user_id": uuidv4(),
			"organization_id": uuid,
			"mail_address": req.body.mail_address,
			"account_name": req.body.account_name,
			"password": req.body.password,
		}
	};
	axios.post(`/organization`, _.omitBy(school, _.isNil)).then(function (response) {
		res.send({ "organization_id": response.data.organization.organization_id });
		res.end();
	}).catch(function (error) {
		next(error);
	});
});

app.put("/school", function (req, res, next) {
	let organization = _.omitBy(req.body.organization, _.isNil);
	let school = _.omitBy(req.body.school, _.isNil);
	let user = _.omitBy(req.body.user, _.isNil);
	axiosBase.all([
		_.isEmpty(organization) ? "" : axios.put(`/organization/${req.body.organization_id}`, organization),
		_.isEmpty(school) ? "" : axios.put(`/school/${req.body.organization_id}`, _.merge({"school_id": req.body.organization_id}, school)),
		_.isEmpty(user) ? "" : axios.put(`/user/${req.body.user_id}`, _.merge({
			"user_id": req.body.user_id,
			"organization_id": req.body.organization_id
		}, user)),
	]).then(axiosBase.spread((res1, res2, res3) => {
		res.send({
			"organization_id": req.body.organization_id
		});
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.delete("/school/:id", function (req, res, next) {

	axiosBase.all([
		axios.delete(`/organization/${req.params.id}`),
		axios.delete(`/school/${req.params.id}`),
	]).then(axiosBase.spread((res1, res2) => {
		let resData = {};
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.get("/school_activity", function (req, res, next) {

	axios.get(`/schoolActivity`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				address: data.prefecture + data.city,
				school_type: _.get(data, 'school.school_type'),
				scholarship_request: _.get(data, 'school.scholarship_request'),
				internship_request: _.get(data, 'school.internship_request'),
				practice_request: _.get(data, 'school.practice_request'),
				fair_application_status: // 説明会申込状況 = 申込中の申込の有無
					_.filter(
						_.get(data, 'school.fair_applications'), (dt) => {
							return dt.application_status === CONST.application_status.APPLYING.value;
						}
					).length > 0,
				fair_application_count: // 説明会申込回数 = 説明会申込した数
					_.filter(
						_.get(data, 'school.fair_applications'), (dt) => {
							return dt.application_status !== CONST.application_status.CANCEL.value;
						}
					).length,
				channel_participation_count: // チャンネル参加数 = 自分が参加した完了イベント数
					_.filter(
						_.get(data, 'event_members'), (dt) => {
							return _.get(dt, "online_event.event_status") === CONST.event_status.DONE.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE_NO_PAY.value
						}
					).length,
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/hospital", function (req, res, next) {

	axios.get(`/hospital`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				organization_name_kana: data.organization_name_kana,
				address: data.prefecture + data.city,
				mail_address: _.get(data, 'user.mail_address'),
				homepage: data.homepage,
				hospital_type: _.get(data, 'hospital.hospital_type'),
				updated_at: (data.updated_at > _.get(data, 'hospital.updated_at')) ? data.updated_at : _.get(data, 'hospital.updated_at')
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.post("/hospital", function (req, res, next) {
	const uuid = uuidv4();
	let hospital = {
		organization: {
			"organization_id": uuid,
			"organization_type": CONST.organization_type.HOSPITAL.value,
			"organization_name": req.body.organization_name,
			"organization_name_kana": req.body.organization_name_kana,
			"prefecture": req.body.prefecture,
			"city": req.body.city,
			"address": req.body.address,
			"homepage": req.body.homepage,
			"dummy": req.body.dummy,
		},
		organization_sub: {
			"hospital_id": uuid,
			"hospital_type": req.body.hospital_type
		},
		user: {
			"user_id": uuidv4(),
			"organization_id": uuid,
			"mail_address": req.body.mail_address,
			"account_name": req.body.account_name,
			"password": req.body.password,
		}
	};
	axios.post(`/organization`, hospital).then(function (response) {
		res.send({
			"organization_id": response.data.organization.organization_id
		});
		res.end();
	}).catch(function (error) {
		next(error);
	});
});

app.put("/hospital", function (req, res, next) {
	let organization = _.omitBy(req.body.organization, _.isNil);
	let hospital = _.omitBy(req.body.hospital, _.isNil);
	let user = _.omitBy(req.body.user, _.isNil);
	axiosBase.all([
		_.isEmpty(organization) ? "" : axios.put(`/organization/${req.body.organization_id}`, organization),
		_.isEmpty(hospital) ? "" : axios.put(`/hospital/${req.body.organization_id}`, _.merge({"hospital_id": req.body.organization_id}, hospital)),
		_.isEmpty(user) ? "" : axios.put(`/user/${req.body.user_id}`, _.merge({
			"user_id": req.body.user_id,
			"organization_id": req.body.organization_id
		}, user)),
	]).then(axiosBase.spread((res1, res2, res3) => {
		res.send({
			"organization_id": req.body.organization_id
		});
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/hospital/:id", function (req, res, next) {

	axiosBase.all([
		axios.get(`/organization/${req.params.id}`),
		axios.get(`/hospital/${req.params.id}`),
		axios.get(`/organization/${req.params.id}/user`),
	]).then(axiosBase.spread((res1, res2, res3) => {
		let resData = {
			organization_id: _.get(res1, 'data.organization_id'),
			organization_name: _.get(res1, 'data.organization_name'),
			organization_name_kana: _.get(res1, 'data.organization_name_kana'),
			prefecture: _.get(res1, 'data.prefecture'),
			city: _.get(res1, 'data.city'),
			address: _.get(res1, 'data.address'),
			full_address: _.get(res1, 'data.prefecture') + _.get(res1, 'data.city') + _.get(res1, 'data.address'),
			homepage: _.get(res1, 'data.homepage'),
			mail_address: _.get(res3, 'data.mail_address'),
			hospital_id: _.get(res2, 'data.hospital_id'),
			hospital_type: _.get(res2, 'data.hospital_type'),
			user_id: _.get(res3, 'data.user_id'),
			account_name: _.get(res3, 'data.account_name'),
			password: _.get(res3, 'data.password'),
			dummy: _.get(res1, 'data.dummy') === '0' ? false : true,
		};
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.delete("/hospital/:id", function (req, res, next) {

	axiosBase.all([
		axios.delete(`/organization/${req.params.id}`),
		axios.delete(`/hospital/${req.params.id}`),
	]).then(axiosBase.spread((res1, res2) => {
		let resData = {};
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.get("/hospital_activity", function (req, res, next) {

	axios.get(`/hospitalActivity`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_id: data.organization_id,
				organization_name: data.organization_name,
				address: data.prefecture + data.city,
				hospital_type: _.get(data, 'hospital.hospital_type'),
				fair_open_status:
					!_.isEmpty(
						_.filter(
							_.get(data, 'fair'),
							(dt) => dt.fair_status === CONST.fair_status.RECRUITING.value
						)
					), // true: 募集中 false: 募集してない
				fair_count: _.filter(
					_.get(data, 'fair'),
					(dt) => dt.fair_status !== CONST.fair_status.CANCEL.value
				).length,
				channel_participation_count:
					_.filter(
						_.get(data, 'event_members'), (dt) => {
							return _.get(dt, "online_event.event_status") === CONST.event_status.OFFICIAL.value
								|| _.get(dt, "online_event.event_status") === CONST.event_status.DONE.value
						}
					).length,
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/fair", function (req, res, next) {

	axios.get(`/fair`).then(function (response) {
		// onlineeventをもつfair(fairとonlineeventを直積する)
		var hasEventFair = _.flatMap(response.data, (dt) => {
			return _.map(dt.online_events, (dt2) => {
				return {
					fair_id: dt.fair_id,
					hospital_id: dt.hospital_id,
					organization_name: _.get(dt, 'organization.organization_name'),
					fair_type: _.map(_.get(dt, 'fair_type'), (dt3) => { return _.get(dt3, 'fair_type') }),
					plan_start_at: _.get(dt, 'plan_start_at'),
					plan_end_at: _.get(dt, 'plan_end_at'),
					fair_status: _.get(dt, 'fair_status'),
					event_id: dt2.event_id,
					_fair_id: dt2.fair_id,
					event_type: dt2.event_type,
					event_status: dt2.event_status,
					start_at: dt2.start_at,
					end_at: dt2.end_at,
					estimate_status: _.get(dt2, 'estimate.estimate_status'),
					estimate_price: _.get(dt2, 'estimate.estimate_price'),
					application_count: _.filter(_.get(dt, 'fair_applications'), (dt3) => dt3.application_status !== CONST.application_status.CANCEL.value).length,
				}
			})
		})
		// onlineeventをもたないfair
		var nohasEventFair = _.map(_.filter(response.data, (dt) => _.isEmpty(dt.online_events)), (dt) => {
			return {
				fair_id: dt.fair_id,
				hospital_id: dt.hospital_id,
				organization_name: _.get(dt, 'organization.organization_name'),
				fair_type: _.map(_.get(dt, 'fair_type'), (dt2) => { return _.get(dt2, 'fair_type') }),
				plan_start_at: _.get(dt, 'plan_start_at'),
				plan_end_at: _.get(dt, 'plan_end_at'),
				fair_status: _.get(dt, 'fair_status'),
				application_count: _.filter(_.get(dt, 'fair_applications'), (dt2) => dt2.application_status !== CONST.application_status.CANCEL.value).length,
			}
		})

		var resData = _.orderBy(hasEventFair.concat(nohasEventFair), ['plan_start_at', 'fair_id'], ['desc', 'desc'])
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.put("/fair", function (req, res, next) {
	const event_id = req.body.event_id ? req.body.event_id : uuidv4();
	const estimate_id = req.body.estimate_id ? req.body.estimate_id : uuidv4();
	let fair = {
		"fair_status": req.body.fair_status,
	};
	let reqEvent = {
		"event_type": req.body.event_type,
		"event_status": req.body.event_status,
		"start_at": req.body.event_start_at,
		"end_at": req.body.event_end_at,
	};
	let event = _.merge({
		"event_id": event_id,
		"fair_id": req.body.fair_id,
	}, reqEvent);
	let reqEstimate = {
		"estimate_status": req.body.estimate_status,
		"regular_price": req.body.regular_price,
		"discount_price": req.body.discount_price,
	};
	let estimate = _.merge({
		"estimate_id": estimate_id,
		"event_id": event_id,
		"estimate_price": req.body.regular_price - req.body.discount_price,
	}, reqEstimate);
	const fair_participant = _.map(_.get(req.body, "event_member"), (organization_id) => {
		return { // 学校
			"event_id": event_id,
			"organization_id": organization_id,
			"member_role": CONST.member_role.OTHER.value,
		}}
	);
	const fived = [{ // 5D
		"event_id": event_id,
		"organization_id": req.body.organization_id,
		"member_role": CONST.member_role.OWNER.value,

	}];
	const fair_organizer = [{ // 病院
		"event_id": event_id,
		"organization_id": req.session.passport.user.organization_id,
		"member_role": CONST.member_role.OTHER.value,
	}];
	// 全てを結合する(organization_idで重複は除く)　※イベントメンバー更新時は、リクエストデータ中に5Dと病院データを既に持っており、重複してしまう為
	const event_member = _.unionBy(fived, fair_organizer, fair_participant, "organization_id");
	axiosBase.all([
		axios.put(`/fair/${req.body.fair_id}`, _.omitBy(fair, _.isNil)),
		_.isEmpty(_.omitBy(reqEvent, _.isNil)) ? "" : (req.body.event_id ? axios.put(`/onlineEvent/${req.body.event_id}`, _.omitBy(event, _.isNil)) : axios.post(`/onlineEvent`, _.omitBy(event, _.isNil))),
		_.isEmpty(_.omitBy(reqEstimate, _.isNil)) ? "" : (req.body.estimate_id ? axios.put(`/estimate/${req.body.estimate_id}`, _.omitBy(estimate, _.isNil)) : axios.post(`/estimate`, _.omitBy(estimate, _.isNil))),
		_.isEmpty(_.omitBy(fair_participant, _.isNil)) ? "" : axios.put(`/eventMember/${event_id}`, event_member),
	]).then(axiosBase.spread((res1, res2, res3) => {
		res.send(event);
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/fair/:fair_id", function (req, res, next) {

	axiosBase.all([
		axios.get(`/fair/${req.params.fair_id}`),
		req.query.event_id ? axios.get(`/onlineEvent/${req.query.event_id}`) : "",
		axios.get(`/fair/${req.params.fair_id}/detail`),
		axios.get(`/fair/${req.params.fair_id}/application`),
		req.query.event_id ? axios.get(`/onlineEvent/${req.query.event_id}/estimate`) : "",
		req.query.event_id ? axios.get(`/eventMember/${req.query.event_id}`) : "",
	]).then(axiosBase.spread((res1, res2, res3, res4, res5, res6) => {
		const event_id = _.get(res2, 'data.event_id');
		const event_start_at = _.get(res2, 'data.start_at') ? dayjs(_.get(res2, 'data.start_at')).format("YYYY-MM-DD HH:mm:00") : null;
		const event_end_at = _.get(res2, 'data.end_at') ? dayjs(_.get(res2, 'data.end_at')).format("YYYY-MM-DD HH:mm:00") : null;
		let resData = {
			"fair_id": _.get(res1, 'data.fair_id'),
			"organization_id": _.get(res1, 'data.organization.organization_id'),
			"organization_name": _.get(res1, 'data.organization.organization_name'),
			"fair_type": _.map(_.get(res1, 'data.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
			"plan_start_at": _.get(res1, 'data.plan_start_at'),
			"plan_end_at": _.get(res1, 'data.plan_end_at'),
			"fair_status": _.get(res1, 'data.fair_status'),
			"event_id": event_id,
			"event_start_at": event_start_at,
			"event_end_at": event_end_at,
			"event_type": _.get(res2, 'data.event_type'),
			"event_status": _.get(res2, 'data.event_status'),
			"append": _.map(_.omitBy(_.get(res3, 'data'), _.isNil), (dt) => {
				return {
					id: uuidv4(),
					hospital_id: _.get(dt, "append_info.hospital_id"),
					append_information_type: _.get(dt, "append_info.append_information_type"),
					recruiting_period_start: _.get(dt, "append_info.recruiting_period_start"),
					recruiting_period_end: _.get(dt, "append_info.recruiting_period_end"),
					recruiting_job_type: _.get(dt, "append_info.recruiting_job_type"),
					comment: _.get(dt, "append_info.comment"),
					various_matters: _.get(dt, "append_info.various_matters"),
					other: _.get(dt, "append_info.other"),
					hospital_scholarship: _.get(dt, "append_info.hospital_scholarship"),
					hospital_intership: _.get(dt, "append_info.hospital_intership"),
					hospital_practice: _.get(dt, "append_info.hospital_practice"),
					hospital_fair: {
						append_information_id: _.get(dt, "append_info.hospital_fair.append_information_id"),
						target_person: _.get(dt, "append_info.hospital_fair.target_person"),
						hospital_fair_type: _.map(_.get(dt, "append_info.hospital_fair.hospital_fair_type"), (dt2) => { return _.get(dt2, 'hospital_fair_type') }),
					}
				}
			}),
			"fair_application": _.omitBy(_.get(res4, 'data'), _.isNil),
			"estimate_id": _.get(res5, 'data.estimate_id'),
			"estimate_status": _.get(res5, 'data.estimate_status'),
			"regular_price": _.get(res5, 'data.regular_price'),
			"discount_price": _.get(res5, 'data.discount_price'),
			"estimate_price": _.get(res5, 'data.estimate_price'),
			"event_member": _.map(_.get(res6, 'data'), (dt) => { return _.get(dt, 'organization.organization_id') }),
		};
		res.send(_.omitBy(resData, _.isNil));
	})).catch(function (error) {
		next(error);
	});
});

app.post("/event", function (req, res, next) {
	const event_id = uuidv4();
	let event = {
		"event_id": event_id,
		"fair_id": req.body.fair_id,
		"event_type": req.body.event_type,
		"event_status": CONST.event_status.UNDECIDED.value,
		"start_at": req.body.event_start_at,
		"end_at": req.body.event_end_at,
	};
	axiosBase.all([
		axios.post(`/onlineEvent`, event),
	]).then(axiosBase.spread((res1) => {
		res.send(event);
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/fairApplication", function (req, res, next) {

	axios.get(`/fairApplication`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				application_id: _.get(data, 'application_id'),
				school_name: _.get(data, 'organization.organization_name'),
				application_datetime: _.get(data, 'application_datetime'),
				application_status: _.get(data, 'application_status'),
				fair_format: _.get(data, 'format'),
				estimate_participant_number: _.get(data, 'estimate_participant_number'),
				organization_name: _.get(data, 'fair.organization.organization_name'),
				fair_type: _.map(_.get(data, 'fair.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
				plan_start_at: _.get(data, 'fair.plan_start_at'),
				plan_end_at: _.get(data, 'fair.plan_end_at'),
				fair_status: _.get(data, 'fair.fair_status'),
				start_at: _.get(data, 'fair.online_events.0.start_at'),
				end_at: _.get(data, 'fair.online_events.0.end_at'),
				event_status: _.get(data, 'fair.online_events.0.event_status')
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.put("/fairApplication", function (req, res, next) {
	let fair_application = {
		"application_status": req.body.application_status,
	};
	axiosBase.all([
		axios.put(`/fairApplication/${req.body.application_id}`, _.omitBy(fair_application, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/fairApplication/:appl_id", function (req, res, next) {
	axiosBase.all([
		axios.get(`/fairApplication/${req.params.appl_id}`),
		axios.get(`/fairApplication/${req.params.appl_id}/fair`)
	]).then(axiosBase.spread((res1, res2) => {
		let resData = {
			application_id: _.get(res1, 'data.application_id'),
			format: _.get(res1, 'data.format'),
			estimate_participant_number: _.get(res1, 'data.estimate_participant_number'),
			comment: _.get(res1, 'data.comment'),
			application_status: _.get(res1, 'data.application_status'),
			organization_name: _.get(res1, 'data.organization.organization_name'),
			application_datetime: _.get(res1, 'data.application_datetime'),
			fair: {
				organization_name: _.get(res2, 'data.fair.organization.organization_name'),
				fair_type: _.map(_.get(res2, 'data.fair.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
				plan_start_at: _.get(res2, 'data.fair.plan_start_at'),
				plan_end_at: _.get(res2, 'data.fair.plan_end_at'),
				event_status: _.get(res2, 'data.fair.online_events_latest.0.event_status'),
				fair_status: _.get(res2, 'data.fair.fair_status'),
				start_at: _.get(res2, 'data.fair.online_events_latest.0.start_at'),
				end_at: _.get(res2, 'data.fair.online_events_latest.0.end_at'),
			}
		}
		res.send(resData);
	})).catch(function (error) {
		next(error);
	});
});

app.get("/channel", function (req, res, next) {
	axios.get(`/onlineEvent`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				event_id: _.get(data, 'event_id'),
				event_type: _.get(data, 'event_type'),
				channel_mode: _.get(data, 'channel_status'),
				owner_name: _.get(_.filter(_.get(data, 'event_member'), (dt) => _.get(dt, 'member_role') === CONST.member_role.OWNER.value), "0.organization.organization_name"),
				member_count: _.get(data, 'event_member').length,
				organization_name: _.get(data, 'fair.organization.organization_name'),
				fair_type: _.map(_.get(data, 'fair.fair_type'), (dt) => { return _.get(dt, 'fair_type') }),
				event_status: _.get(data, 'event_status'),
				start_at: _.get(data, 'start_at'),
				end_at: _.get(data, 'end_at'),
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/channel/:event_id", function (req, res, next) {
	axiosBase.all([
		axios.get(`/onlineEvent/${req.params.event_id}`),
		axios.get(`/eventMember/${req.params.event_id}`),
	]).then(axiosBase.spread((res1, res2) => {
		const fair_id = _.get(res1, 'data.fair_id');
		if (!fair_id) {
			let resData = {
				"event": _.get(res1, 'data'),
				"event_member": _.get(res2, 'data'),
			};
			res.send(_.omitBy(resData, _.isNil));
			return;
		}

		axiosBase.all([
			axios.get(`/fair/${fair_id}`),
			axios.get(`/fairApplication/${fair_id}/application`),
		]).then(axiosBase.spread((res3, res4) => {
			let resData = {
				"event": _.get(res1, 'data'),
				"event_member": _.get(res2, 'data'),
				"fair": _.get(res3, 'data'),
				"application": _.get(res4, 'data'),
			};
			res.send(_.omitBy(resData, _.isNil));
			return;


		})).catch(function (error) {
			next(error);
		});
	})).catch(function (error) {
		next(error);
	});
});

app.get("/questionary", function (req, res, next) {
	axios.get(`/questionary`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				organization_name: _.get(data, 'organization.organization_name'),
				answered_datetime: _.get(data, 'answered_datetime'),
				fair_type: _.map(_.get(data, 'questionary_fair_types'), (dt) => { return _.get(dt, 'fair_type') }),
				desire_start_at: _.get(data, 'desire_start_at'),
				desire_end_at: _.get(data, 'desire_end_at'),
				questionaryHospital: _.map(_.get(data, 'questionary_hospitals'), (dt) => { return _.get(dt, 'organization.organization_name') }),
				questionaryPlace: _.map(_.get(data, 'questionary_places'), (dt) => { return _.get(dt, 'place') }),
				hospital_type: _.map(_.get(data, 'questionary_hospital_types'), (dt) => { return _.get(dt, 'hospital_type') }),
				comment: _.get(data, 'comment')
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/payment", function (req, res, next) {
	axios.get(`/payment`).then(function (response) {
		let resData = _.map(response.data, (data) => {
			return {
				payment_id: _.get(data, 'payment_id'),
				payment_month: _.get(data, 'payment_month'),
				organization_name: _.get(data, 'organization.organization_name'),
				payment_price: _.get(data, 'payment_price'),
				payment_status: _.get(data, 'payment_status'),
			}
		});
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/payment/:payment_id", function (req, res, next) {
	axios.get(`/payment/${req.params.payment_id}`).then(function (response) {
		let resData = {
			payment_id: _.get(response, 'data.payment_id'),
			payment_month: _.get(response, 'data.payment_month'),
			organization_name: _.get(response, 'data.organization.organization_name'),
			payment_price: _.get(response, 'data.payment_price'),
			payment_status: _.get(response, 'data.payment_status'),
			payment_detail: _.map(_.get(response, 'data.payment_details'), (dt) => {
				return {
					event_type: _.get(dt, 'estimate.online_event.event_type'),
					start_at: _.get(dt, 'estimate.online_event.start_at'),
					end_at: _.get(dt, 'estimate.online_event.end_at'),
					regular_price: _.get(dt, 'estimate.regular_price'),
					discount_price: _.get(dt, 'estimate.discount_price'),
					estimate_price: _.get(dt, 'estimate.estimate_price'),
					event_member_count: _.filter(_.get(dt, 'estimate.online_event.event_member'), (dt2) => {
						return dt2.organization.organization_type === CONST.organization_type.SCHOOL.value;
					}).length,
				}
			}),
		}
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.put("/payment/:payment_id", function (req, res, next) {
	const payment = {
		'payment_status': req.body.payment_status,
		'payment_price': req.body.payment_price,
	};
	axiosBase.all([
		axios.put(`/payment/${req.params.payment_id}`, _.omitBy(payment, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		res.end();
	})).catch(function (error) {
		next(error);
	});
});

app.get("/organization", function (req, res, next) {
	axios.get(`/organization`).then(function (response) {
		let resData =  _.get(response, 'data');
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.post("/individualEvent", function (req, res, next) {
	const event_id = uuidv4();
	let event = {
		"event_id": event_id,
		"event_type": CONST.event_type.INDIVIDUAL.value,
		"event_status": CONST.event_status.OFFICIAL.value,
		"start_at": req.body.start_at,
		"end_at": dayjs(req.body.start_at).add(1, 'hour').format('YYYY-MM-DD HH:mm:00'),
	};

	const fair_participant = [{ // 学校
		"event_id": event_id,
		"organization_id": req.body.organization_id,
		"member_role": CONST.member_role.OTHER.value,
	}];
	const fair_organizer = [{
		"event_id": event_id,
		"organization_id": req.session.passport.user.organization_id,
		"member_role": CONST.member_role.OWNER.value,
	}];
	const event_member = _.unionBy(fair_organizer, fair_participant, "organization_id");
	// event, event_memberの登録が必要
	axiosBase.all([
		axios.post(`/onlineEvent`, _.omitBy(event, _.isNil)),
	]).then(axiosBase.spread((res1) => {
		axiosBase.all([
			axios.put(`/eventMember/${event_id}`, event_member),
		]).then(axiosBase.spread((res3) => {
			res.end();
		})).catch(function (error) {
			next(error);
		});
	})).catch(function (error) {
		next(error);
	});
});

app.get("/channel/:id/edit", function (req, res, next) {
	let resData = {};
	res.send(resData);
});

app.get("/channel/:id/detail", function (req, res, next) {
	let resData = {};
	res.send(resData);
});

app.post("/login", function (req, res, next) {
	axios.post(`/user/login`, req.body).then(function (response) {
		let resData = {
			user_id: _.get(response, 'data.user_id'),
			organization_id: _.get(response, 'data.organization_id'),
			organization_type: _.get(response, 'data.organization_type'),
		};
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}`).then(function (response) {
		let resData = {
			unread: _.some(response.data, {confirm_status: CONST.read_status.UNREAD.value}),
			notification: _.orderBy(_.map(response.data, (data) => {
				return {
					notification_id: _.get(data, 'notification_id'),
					title: _.get(data, 'title'),
					// content: _.get(data, 'content'),
					notification_at: _.get(data, "notification_at"),
				}
			}), 'notification_at', 'desc')
		}
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/notification/:notification_id", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}/${req.params.notification_id}`).then(function (response) {
		let resData = response.data;
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.get("/unread_notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.get(`/notification/${organization_id}`).then(function (response) {
		let resData = {
			unread: _.some(response.data, {confirm_status: CONST.read_status.UNREAD.value}),
			notification: _.orderBy(_.filter(response.data, (data) => {
				return data.confirm_status === CONST.read_status.UNREAD.value;
			}), 'notification_at', 'desc')
		}
		res.send(resData);
	}).catch(function (error) {
		next(error);
	});
});

app.put("/notification", function (req, res, next) {

	// 自分の組織ID
	let organization_id = req.session.passport.user.organization_id;
	axios.put(`/notification/${organization_id}`).then(function (response) {
		res.end();
	}).catch(function (error) {
		next(error);
	});
});

var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

// Endpoint to generate access token
app.get('/token', function (request, response, next) {
	var identity = request.query.identity;
	var room = request.query.room;

	// Create an access token which we will sign and return to the client,
	// containing the grant we just created
	var token = new AccessToken(
		process.env.TWILIO_ACCOUNT_SID || 'AC43eff80459b9b0429c0d2b0395a10d6c',
		process.env.TWILIO_API_KEY || 'SK9b2874d9a154f16da424dc90bb7ce134',
		process.env.TWILIO_API_SECRET || 'Paj7iWmsMpEoOjz9UgHdcowx3P5HdNxb'
	);

	// Assign the generated identity to the token
	token.identity = identity;

	const grant = new VideoGrant({
		room: room
	});
	// Grant token access to the Video API features
	token.addGrant(grant);

	// Serialize the token to a JWT string and include it in a JSON response
	response.send({
		identity: identity,
		token: token.toJwt()
	});
});

function logErrors (err, req, res, next) {
	logger.error(err);
	next(err);
}

function errorHandler (err, req, res, next) {
	res.status(err.status).send({
		error: err.data
	});
}

app.use(logErrors);
app.use(errorHandler);

module.exports = {
	path: "/api/",
	handler: app
};
