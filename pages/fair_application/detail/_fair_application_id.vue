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
						<h4 class="bold uk-heading-divider c_blue01">
							<span>説明会申込情報</span>
						</h4>
						<div>
							<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider uk-text-pre-table">
								<tbody>
									<tr>
										<th class="uk-width-medium">
											学校名
										</th>
										<td>{{ fair_application_dt.organization_name }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											申込日
										</th>
										<td>{{ fair_application_dt.application_datetime | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											申込状態
										</th>
										<td>{{ fair_application_dt.application_status | view("application_status") }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											説明会形式
										</th>
										<td>{{ fair_application_dt.format | view("fair_format") }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											参加予定人数
										</th>
										<td>{{ fair_application_dt.estimate_participant_number | formatNumber }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											コメント
										</th>
										<td>{{ fair_application_dt.comment }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
							<span>説明会情報</span>
						</h4>
						<div>
							<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider">
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
										<td>{{ fair_application_dt.fair.fair_status | view("fair_status") }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="uk-margin-large-top uk-text-center">
							<nuxt-link :to="`/fair_application/edit/${$route.params.fair_application_id}`">
								<input id="form-submit"
									class="sc-button sc-button-secondary waves-effect waves-button waves-light"
									type="submit"
									value="編集"
								>
							</nuxt-link>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import ScTextarea from '~/components/ui/Textarea'
import { CONST } from '~/const.js';
import _ from 'lodash';

export default {
	components: {
	},
	data: () => ({
		notification: {
			default: '登録しました',
		},
		'application_status':'選択してください',
	}),
	computed: {
		fairTypes () {
			return CONST.getCode("fair_type");
		}
	},
	async asyncData ( {app, params} ) {
		let { data } = await app.$axios.get(`/api/fairApplication/${params.fair_application_id}`);
		return {
			fair_application_dt: data
		}
	},
	methods: {
		checkedTest (value) {
			return _.some(this.fair_application_dt.fair.fair_type, (dt) => dt === value);
		},
		showNotification (text, pos, status, persistent) {
			var config = {};
			config.timeout = persistent ? !persistent : 3000;
			if(status) {
				config.status = status;
			}
			if(pos) {
				config.pos = pos;
			}
			UIkit.notification(text, config);
		},
	}
}
</script>
