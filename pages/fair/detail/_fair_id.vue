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
							詳細画面
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
							<h4 class="bold uk-heading-divider c_blue01">
								<span>予定情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
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
											<tr>
												<th class="uk-width-medium">
													説明会状態
												</th>
												<td>{{ fair_dt.fair_status | view('fair_status') }}</td>
											</tr>
										</tbody>
									</table>
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
												<th class="max_w115 uk-text-bold uk-text-center">
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
												<td>
													<div class="uk-form-controls">
														<ul class="uk-list uk-margin-remove">
															<li class="flex_center">
																<label>
																	<input
																		v-model="fair_dt.event_member"
																		class="uk-checkbox"
																		disabled="disabled"
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
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>イベント情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													イベント状態
												</th>
												<td>{{ fair_dt.event_status | view('event_status') }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													イベント種別
												</th>
												<td>{{ fair_dt.event_type | view('event_type') }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													開始日時
												</th>
												<td>{{ fair_dt.event_start_at }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													終了日時
												</th>
												<td>{{ fair_dt.event_end_at }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>見積情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													見積金額
												</th>
												<td>{{ fair_dt.estimate_price | formatCurrency('JPY') }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													正規価格
												</th>
												<td>{{ fair_dt.regular_price | formatCurrency('JPY') }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													割引価格
												</th>
												<td>{{ fair_dt.discount_price | formatCurrency('JPY') }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													見積状態
												</th>
												<td>{{ fair_dt.estimate_status | view('estimate_status') }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<FairAppendDetail
								:fair_dt="fair_dt"
							></FairAppendDetail>
							<div class="uk-margin-large-top uk-text-center">
								<nuxt-link :to="`/fair/edit/${$route.params.fair_id}${$route.query.event_id ? '?event_id='+ $route.query.event_id : ''}`">
									<input id="form-submit"
										class="sc-button sc-button-secondary waves-effect waves-button waves-light"
										type="submit"
										value="編集"
									>
								</nuxt-link>
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
import FairAppendDetail from "~/components/pages/FairAppendDetail.vue";
import { CONST } from '~/const.js';
import _ from 'lodash';

export default {
	components: {
		FairAppendDetail
	},
	data: () => ({
		fair_dt: "",
	}),
	computed: {
		fairTypes () {
			return CONST.getCode("fair_type");
		},
	},
	async asyncData ( {app, params, error, route} ) {
		let { data } = await app.$axios.get(`/api/fair/${params.fair_id}${route.query.event_id ? '?event_id='+route.query.event_id : ''}`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { fair_dt: data }
	},
	methods: {
		getFairApplication (fair_dt) {
			return _.get(fair_dt, 'fair_application');
		},
		checkedTest (value, array) {
			return _.some(array, (dt) => dt === value);
		},
	}
}
</script>
<style lang="scss">
	.flexmiddle{
		display: flex;
		align-items: center;
	}
</style>
