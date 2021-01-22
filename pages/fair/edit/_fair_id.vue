<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/fair/">
							説明会一覧
						</nuxt-link>
					</li>
					<li>
						<span>
							編集画面
						</span>
					</li>
				</ul>
			</div>
		</div>
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<div class="uk-form-stacked">
							<div>
								<h4 class="bold uk-heading-divider c_blue01">
									<span>予定情報</span>
								</h4>
								<div>
									<div>
										<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider">
											<tbody>
												<tr>
													<th class="uk-width-medium">
														病院名
													</th>
													<td>{{ fair_dt.organization_name }}</td>
												</tr>
												<tr>
													<th class="uk-width-medium">
														説明会種別
													</th>
													<td>
														<ul class="uk-list">
															<li v-for="fairType in fairTypes" :key="fairType.value">
																<label>
																	<input
																		:checked="checkedTest(fairType.value, fair_dt.fair_type)"
																		class="uk-checkbox"
																		type="checkbox"
																		disabled="disabled"
																		:value="fairType.value"
																	>
																	{{ fairType.text }}
																</label>
															</li>
														</ul>
													</td>
												</tr>
												<tr>
													<th class="uk-width-medium">
														開催開始予定日
													</th>
													<td>{{ fair_dt.plan_start_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
												</tr>
												<tr>
													<th class="uk-width-medium">
														開催終了予定日
													</th>
													<td>{{ fair_dt.plan_end_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
												</tr>
												<tr v-if="fairStatusCannotChange">
													<th class="uk-width-medium">
														説明会状態
													</th>
													<td>{{ fair_dt.fair_status | view('fair_status') }}</td>
												</tr>
											</tbody>
										</table>
										<div v-if="!fairStatusCannotChange" class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="fair_status">
												<span class="contact_label required">必須</span>説明会状態
											</label>
											<div class="uk-form-controls">
												<client-only>
													<Select2
														id="fair_status"
														v-model="$v.fair_dt.fair_status.$model"
														:error-state="$v.fair_dt.fair_status.$error"
														:validator="$v.fair_dt.fair_status"
														class="uk-select2"
														:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
													>
														<option
															v-for="data in fairStatus"
															:key="data.value"
															:value="data.value"
														>
															{{ data.text }}
														</option>
													</Select2>
													<ul class="sc-vue-errors">
														<li v-if="!$v.fair_dt.fair_status.required">
															必須項目です
														</li>
													</ul>
												</client-only>
											</div>
										</div>
									</div>
								</div>
								<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
									<span>申込情報</span>
								</h4>
								<div class="table_nowrap">
									<div class="vgt-responsive">
										<table class="uk-table uk-table-divider scutum-vgt uk-table-middle uk-table-striped">
											<thead>
												<tr>
													<th class="uk-text-bold uk-width-medium">
														学校名
													</th>
													<th class="max_w115 uk-text-bold">
														参加予定人数
													</th>
													<th class="max_w115 uk-text-bold">
														申込状態
													</th>
													<th v-if="routeEventId" class="max_w115 uk-text-bold uk-text-center">
														イベントメンバー
													</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="data in getFairApplication(fair_dt)" :key="data.application_id">
													<td class="uk-width-medium">
														{{ data.organization.organization_name }}
													</td>
													<td>{{ data.estimate_participant_number }}</td>
													<td>{{ data.application_status | view("application_status") }}</td>
													<td v-if="routeEventId">
														<div class="uk-form-controls">
															<ul class="uk-list uk-margin-remove">
																<li class="flex_center">
																	<label>
																		<input
																			v-model="$v.fair_dt.event_member.$model"
																			:error-state="$v.fair_dt.event_member.$error"
																			:validator="$v.fair_dt.event_member"
																			class="uk-checkbox"
																			:checked="checkedTest(data.organization.organization_id, fair_dt.event_member)"
																			:value="data.organization.organization_id"
																			type="checkbox"
																		>
																	</label>
																</li>
															</ul>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div v-if="routeEventId">
								<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
									<span>イベント情報</span>
								</h4>
								<div>
									<div class="uk-grid" data-uk-grid>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="event_status">
												<span class="contact_label">任意</span>
												イベント状態
											</label>
											<div class="uk-form-controls">
												<client-only>
													<Select2
														id="event_status"
														v-model="$v.fair_dt.event_status.$model"
														:error-state="$v.fair_dt.event_status.$error"
														:validator="$v.fair_dt.event_status"
														class="uk-select2"
														:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
													>
														<option
															v-for="data in eventStatus"
															:key="data.value"
															:value="data.value"
														>
															{{ data.text }}
														</option>
													</Select2>
												</client-only>
											</div>
										</div>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="event_type">
												<span class="contact_label">任意</span>
												イベント種別
											</label>
											<div class="uk-form-controls">
												<client-only>
													<Select2
														id="event_type"
														v-model="$v.fair_dt.event_type.$model"
														:error-state="$v.fair_dt.event_type.$error"
														:validator="$v.fair_dt.event_type"
														class="uk-select2"
														:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
													>
														<option
															v-for="data in eventType"
															:key="data.value"
															:value="data.value"
														>
															{{ data.text }}
														</option>
													</Select2>
												</client-only>
											</div>
										</div>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label">
												<span class="contact_label">任意</span>
												開催期間
											</label>
											<div class="uk-form-controls uk-margin-small-top">
												<div class="uk-grid" data-uk-grid>
													<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
														<ScInput
															id="event_start_at"
															v-model="$v.fair_dt.event_start_at.$model"
															v-flatpickr="dpTimePicker"
															:error-state="$v.fair_dt.event_start_at.$error"
															:validator="$v.fair_dt.event_start_at"
															mode="outline"
														>
															<label>開催開始日</label>
														</ScInput>
													</div>
													<div class="flexmiddle uk-margin-small-top ">
														~
													</div>
													<div class="uk-width-2-5@s uk-margin-small-top ">
														<ScInput
															id="event_end_at"
															v-model="$v.fair_dt.event_end_at.$model"
															v-flatpickr="dpTimePicker"
															:error-state="$v.fair_dt.event_end_at.$error"
															:validator="$v.fair_dt.event_end_at"
															mode="outline"
														>
															<label>開催終了日</label>
														</ScInput>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
									<span>見積情報</span>
								</h4>
								<div>
									<div class="uk-grid" data-uk-grid>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="estimate_status">
												<span class="contact_label">任意</span>
												見積状態
											</label>
											<div class="uk-form-controls">
												<client-only>
													<Select2
														id="estimate_status"
														v-model="$v.fair_dt.estimate_status.$model"
														class="uk-select2"
														:error-state="$v.fair_dt.estimate_status.$error"
														:validator="$v.fair_dt.estimate_status"
														:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
													>
														<option
															v-for="data in estimateStatus"
															:key="data.value"
															:value="data.value"
														>
															{{ data.text }}
														</option>
													</Select2>
												</client-only>
											</div>
										</div>
									</div>
									<div class="uk-grid" data-uk-grid>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="regular_price">
												<span class="contact_label">任意</span>
												正規金額
											</label>
											<div class="uk-form-controls">
												<ScInput
													id="regular_price"
													v-model="$v.fair_dt.regular_price.$model"
													:error-state="$v.fair_dt.regular_price.$error"
													:validator="$v.fair_dt.regular_price"
													placeholder="100,000"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.fair_dt.regular_price.integer">
														数字を入力してください
													</li>
													<li v-if="!$v.fair_dt.regular_price.maxLength">
														入力可能桁数を超過しています
													</li>
													<li v-if="!$v.fair_dt.discount_price.maxValue">
														割引金額より高く設定してください
													</li>
												</ul>
											</div>
										</div>
									</div>
									<div class="uk-grid" data-uk-grid>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="discount_price">
												<span class="contact_label">任意</span>
												割引金額
											</label>
											<div class="uk-form-controls">
												<ScInput
													id="discount_price"
													v-model="$v.fair_dt.discount_price.$model"
													:error-state="$v.fair_dt.discount_price.$error"
													:validator="$v.fair_dt.discount_price"
													placeholder="100,000"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.fair_dt.discount_price.integer">
														数字を入力してください
													</li>
													<li v-if="!$v.fair_dt.discount_price.maxLength">
														入力可能桁数を超過しています
													</li>
													<li v-if="!$v.fair_dt.discount_price.maxValue">
														正規金額より低く設定してください
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[{'sc-button-progress': btnLoading},[ inputDiff === false ? 'sc-button-secondary' : 'sc-button-disabled' ]]"
									:disabled="btnLoading || inputDiff"
									@click.prevent="saveFair()"
								>
									<span v-if="!btnLoading">編集</span>
									<ScProgressCircular v-else light></ScProgressCircular>
								</button>
							</div>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import { Japanese } from "flatpickr/dist/l10n/ja.js"
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import { ScProgressCircular } from "~/components/ui/progress";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, integer, email, sameAs, minValue, maxValue } from "vuelidate/lib/validators";
import moment from '~/plugins/moment'
import _ from 'lodash';
import { CONST } from '~/const.js';

if(process.client) {
	require('~/plugins/flatpickr');
}
export default {
	components: {
		ScInput,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},

	mixins: [validationMixin],

	data: () => ({
		btnLoading: false,
		Japanese
	}),

	computed: {
		fairStatusCannotChange () {
			return this.pristine_fair_dt.fair_status === CONST.fair_status.END.value ||
				this.pristine_fair_dt.fair_status === CONST.fair_status.CANCEL.value;
		},
		routeEventId () {
			return this.$route.query.event_id
		},
		fairStatus () {
			return CONST.getCode("fair_status");
		},
		eventType () {
			return CONST.getCode("event_type").filter((dt) => dt.value != CONST.event_type.INDIVIDUAL.value);
		},
		eventStatus () {
			return CONST.getCode("event_status");
		},
		fairTypes () {
			return CONST.getCode("fair_type");
		},
		estimateStatus () {
			return CONST.getCode("estimate_status");
		},
		dpTimePicker () {
			const self = this;
	    	return {
				locale: self.Japanese,
				enableTime: true,
				time_24hr: true,
				plugins: [new confirmDatePlugin({
					confirmIcon: "<i class='mdi mdi-check'></i>",
					confirmText: ""
				})],
				dateFormat: "Y-m-d H:i:00",
			}
		},
		dpRange () {
			return {
				mode: "range",
				plugins: [confirmDatePlugin]
			}
		},
		dpMultipleDates () {
			return {
				mode: "multiple",
				wrap: true,
				plugins: [confirmDatePlugin]
			}
		},
		flatpickr () {
			return {
				enableTime: true,
				noCalendar: true,
				dateFormat: "H:i",
			}
		},
		isViewEstimate () {
			return [
				CONST.event_status.TENTATIVE.value,
				CONST.event_status.OFFICIAL.value,
				CONST.event_status.CANCEL.value,
				CONST.event_status.DONE.value
			].indexOf(this.fair_dt.event_status) >= 0;
		},
		inputDiff () {
			return _.isEqual(this.pristine_fair_dt, this.fair_dt)
		},
	},

	async asyncData ({app, params, route}) {
		let fair_dt = {
			fair_id: null,
			fair_status: null,
			event_status: null,
			event_type: null,
			event_start_at: null,
			event_end_at: null,
			regular_price: null,
			discount_price: null,
			estimate_status: null,
			event_member: [],
		};
		let { data, error } = await app.$axios.get(`/api/fair/${params.fair_id}${route.query.event_id ? '?event_id='+route.query.event_id : ''}`);
		if (error) {
			return { fair_dt: fair_dt };
		} else {
			return { 
				fair_dt: Object.assign(fair_dt, data), 
				fair_status: data.fair_status,
				pristine_fair_dt: _.cloneDeep(fair_dt)
			};
		}
	},

	methods: {
		async saveFair () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			res = await this.$axios.put(`/api/fair`, this.fair_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				UIkit.notification("登録しました");
				this.$router.go(-1);
			}
		},
		async getFair (fair_id) {
			let { data, error } = await this.$axios.get(
				`/api/fair/${fair_id}${this.$route.query.event_id ? '?event_id='+this.$route.query.event_id : ''}`
			);
			if (error) {
			} else {
				Object.assign(this.fair_dt, data);
			}
		},
		checkedTest (value, array) {
			return _.some(array, (dt) => dt === value);
		},
		getFairApplication (fair_dt) {
			return _.get(fair_dt, 'fair_application');
		},
	},

	validations () {
		if (this.fair_dt.estimate_id) {
			return {
				fair_dt: {
					fair_status: {
						required
					},
					event_member: {
					},
					event_type: {
					},
					event_start_at: {
					},
					event_end_at: {
					},
					event_status: {
					},
					regular_price: {
						maxLength: maxLength(7),
						integer,
						minValue: minValue(this.fair_dt.discount_price)
					},
					discount_price: {
						maxLength: maxLength(7),
						integer,
						maxValue: maxValue(this.fair_dt.regular_price)
					},
					estimate_status: {
					},
				}
			}
		} else if (this.fair_dt.event_id) {
			return {
				fair_dt: {
					fair_status: {
						required
					},
					event_member: {
					},
					event_type: {
					},
					event_start_at: {
					},
					event_end_at: {
					},
					event_status: {
					},
					regular_price: {
						maxLength: maxLength(7),
						integer
					},
					discount_price: {
						maxLength: maxLength(7),
						integer
					},
					estimate_status: {
					},
				}
			}
		} else {
			return {
				fair_dt: {
					fair_status: {
						required
					},
				}
			}
		}
	}
}
</script>
