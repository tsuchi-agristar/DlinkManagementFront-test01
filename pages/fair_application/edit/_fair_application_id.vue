<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/fair_application/">
							説明会申込
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
						<form class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>説明会申込情報</span>
							</h4>
							<div>
								<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider">
									<tbody>
										<tr>
											<th class="uk-width-medium">
												学校名
											</th>
											<td>{{ fair_application_dt.organization_name }}</td>
										</tr>
										<tr>
											<th class="uk-width-medium">
												説明会形式
											</th>
											<td>{{ fair_application_dt.format }}</td>
										</tr>
										<tr>
											<th class="uk-width-medium">
												参加予定人数
											</th>
											<td>{{ fair_application_dt.estimate_participant_number }}</td>
										</tr>
										<tr>
											<th class="uk-width-medium">
												コメント
											</th>
											<td>{{ fair_application_dt.comment }}</td>
										</tr>
									</tbody>
								</table>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="application_status">
											<span class="contact_label required">必須</span>申込状態
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="application_status"
													v-model="$v.fair_application_dt.application_status.$model"
													:error-state="$v.fair_application_dt.application_status.$error"
													:validator="$v.fair_application_dt.application_status"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in applicationStatus"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
												<ul class="sc-vue-errors">
													<li v-if="!$v.fair_application_dt.application_status.required">
														必須項目です
													</li>
												</ul>
											</client-only>
										</div>
									</div>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>説明会情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													病院名
												</th>
												<td>{{ fair_application_dt.fair.organization_name }}</td>
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
																	:checked="checkedTest(fairType.value)"
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
												<td>{{ fair_application_dt.fair.plan_start_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													開催終了予定日
												</th>
												<td>{{ fair_application_dt.fair.plan_end_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													説明会状態
												</th>
												<td>{{ fair_application_dt.fair.fair_status | view('fair_status') }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<button
									v-waves.button.light
									class="sc-button sc-button-secondary"
									:class="{'sc-button-progress': btnLoading}"
									:disabled="btnLoading"
									@click.prevent="saveFairApplication()"
								>
									<span v-if="!btnLoading">編集</span>
									<ScProgressCircular v-else light></ScProgressCircular>
								</button>
							</div>
						</form>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import { ScProgressCircular } from "~/components/ui/progress";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { CONST } from '~/const.js';

if(process.client) {
	require('~/plugins/flatpickr');
}

export default {
	components: {
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
	}),
	computed: {
		applicationStatus () {
			return CONST.getCode("application_status").filter((dt) => dt.value != CONST.application_status.CANCEL.value);;
		},
		fairTypes () {
			return CONST.getCode("fair_type");
		}
	},
	async asyncData ( {app, params} ) {
		let fair_application_dt = {
			application_status: null,
		};
		let { data, error } = await app.$axios.get(`/api/fairApplication/${params.fair_application_id}`);
		if (error) {
			return { fair_application_dt: fair_application_dt };
		} else {
			return { fair_application_dt: Object.assign(fair_application_dt, data) };
		}
	},
	methods: {
		checkedTest (value) {
			return this.fair_application_dt.fair.fair_type.some((dt) => dt === value);
		},
		async saveFairApplication () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			res = await this.$axios.put(`/api/fairApplication`, this.fair_application_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				UIkit.notification("登録しました");
				this.$router.go(-1);
			}
		},
		async getFairApplication () {
			let { data, error } = await this.$axios.get(`/api/fairApplication/${this.$route.params.fair_application_id}`);
			if (error) {
			} else {
				Object.assign(this.fair_application_dt, data);
			}
		},
	},
	validations: {
		fair_application_dt: {
			application_status: {
				required
			},
		}
	}
}
</script>
