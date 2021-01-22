<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/payment/">
							請求一覧
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
								<span>請求情報</span>
							</h4>
							<div>
								<div>
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													請求月
												</th>
												<td>{{ payment_dt.payment_month | formatTzToAsiaTokyo("YYYY/MM") }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													病院名
												</th>
												<td>{{ payment_dt.organization_name }}</td>
											</tr>
										</tbody>
									</table>
									<div class="uk-grid" data-uk-grid>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="payment_price">
												<span class="contact_label required">必須</span>請求金額
											</label>
											<div class="uk-form-controls">
												<ScInput
													id="payment_price"
													v-model="$v.payment_dt.payment_price.$model"
													:error-state="$v.payment_dt.payment_price.$error"
													:validator="$v.payment_dt.payment_price"
													placeholder="100,000"
													mode="outline"
												>
												</ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.payment_dt.payment_price.required">
														必須項目です
													</li>
													<li v-if="!$v.payment_dt.payment_price.integer">
														数字を入力してください
													</li>
													<li v-if="!$v.payment_dt.payment_price.maxLength">
														入力可能桁数を超過しています
													</li>
												</ul>
											</div>
										</div>
										<div class="uk-width-1-1@m uk-first-column">
											<label class="uk-form-label" for="payment_price">
												<span class="contact_label required">必須</span>請求状態
											</label>
											<div class="uk-form-controls">
												<client-only>
													<Select2
														id="payment_status"
														v-model="$v.payment_dt.payment_status.$model"
														:error-state="$v.payment_dt.payment_status.$error"
														:validator="$v.payment_dt.payment_status"
														:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
														class="uk-Select2"
														mode="outline"
													>
														<option
															v-for="data in paymentStatus"
															:key="data.value"
															:value="data.value"
														>
															{{ data.text }}
														</option>
													</Select2>
													<ul class="sc-vue-errors">
														<li v-if="!$v.payment_dt.payment_status.required">
															必須項目です
														</li>
													</ul>
												</client-only>
											</div>
										</div>
									</div>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>請求明細</span>
							</h4>
							<div class="sc-round ">
								<VueGoodTable
									:columns="columns"
									:rows="payment_dt.payment_detail"
									:pagination-options="{
										mode: 'pages',
										enabled: true,
										rowsPerPageLabel: '表示件数',
										nextLabel: '次へ',
										prevLabel: '前へ',
										pageLabel: '',
										ofLabel: 'ページ目を表示中 / ',
										perPageDropdown: [10,25,50,100],
										dropdownAllowAll: false,
									}"
									style-class="uk-table uk-table-divider scutum-vgt uk-table-middle uk-table-striped"
									:search-options="{
										enabled: false
									}"
									:sort-options="{
										enabled: true,
									}"
								>
									<template slot="table-row" slot-scope="props">
										<span v-if="props.column.field === 'event_type'">
											{{ props.formattedRow[props.column.field]　| view(props.column.field) }}
										</span>
										<span v-else-if="props.column.field === 'start_at' | props.column.field === 'end_at'">
											{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}
										</span>
										<span v-else-if="props.column.field === 'estimate_price'">
											{{ props.formattedRow[props.column.field] | formatCurrency('JPY') }}
										</span>
										<template v-else>
											{{ props.formattedRow[props.column.field] }}
										</template>
									</template>
								</VueGoodTable>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<button id="form-submit"
									type="button"
									class="sc-button"
									:class="[{'sc-button-progress': btnLoading},[ inputDiff === false ? 'sc-button-secondary' : 'sc-button-disabled' ]]"
									:disabled="btnLoading || inputDiff"
									data-uk-toggle="target: #modal-default"
								>
									<span v-if="!btnLoading">登録</span>
									<ScProgressCircular v-else></ScProgressCircular>
								</button>
							</div>
						</form>
					</ScCardBody>
				</ScCard>
				<div id="modal-default" data-uk-modal>
					<div class="uk-modal-dialog uk-modal-body">
						<p>この内容で登録しますか</p>
						<p class="uk-text-center">
							<button
								class="sc-button sc-button-flat uk-modal-close"
								type="button"
							>
								キャンセル
							</button>
							<button
								v-waves.button.light
								class="sc-button sc-button-secondary waves-effect waves-button uk-modal-close waves-light"
								:class="{'sc-button-progress': btnLoading}"
								:disabled="btnLoading"
								@click.prevent="savePayment()"
							>
								はい
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import ScTextarea from '~/components/ui/Textarea'
import { CONST } from '~/const.js';
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, integer, sameAs } from "vuelidate/lib/validators";
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { ScProgressCircular } from '~/components/ui/progress'

export default {
	components: {
		ScInput,
		VueGoodTable,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
		ScProgressCircular,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		btn1LoadingEnd: false,
		notification: {
			default: '登録しました',
		},
		payment_dt:{
			payment_price:'',
			payment_status: []
		},
		'payment_price': '',
	}),
	computed: {
		paymentStatus () {
			return CONST.getCode("payment_status");
		},
		columns () {
			return [
				{
					label: 'イベント種別',
					field: 'event_type',
					sortable: true,
					thClass: 'bghover01 pointer',

				},
				{
					label: '開始日時',
					field: 'start_at',
					sortable: true,
					thClass: 'bghover01 pointer',

				},
				{
					label: '終了日時',
					field: 'end_at',
					sortable: true,
					thClass: 'bghover01 pointer',

				},
				{
					label: '見積金額',
					field: 'estimate_price',
					sortable: true,
					thClass: 'bghover01 pointer',
				},
				{
					label: '参加学校数',
					field: 'event_member_count',
					sortable: true,
					thClass: 'bghover01 pointer',
					type: 'number',
				},
			]
		},
		inputDiff () {
			return _.isEqual(this.pristine_payment_dt, this.payment_dt)
		},
	},
	async asyncData ( {app, params} ) {
		let { data } = await app.$axios.get(`/api/payment/${params.payment_id}`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return {
			payment_dt: data,
			pristine_payment_dt: _.cloneDeep(data)
		}
	},
	methods: {
		async savePayment () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			this.btnLoading = true;
			let res = await this.$axios.put(`/api/payment/${this.$route.params.payment_id}`, this.payment_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				UIkit.notification("登録しました");
				this.$router.go(-1);
			}
		},
		async getPayment () {
			let { data, error } = await this.$axios.get(
				`/api/payment/${this.$route.params.payment_id}`
			);
			if (error) {
			} else {
				this.payment_dt = data;
			}
		}

	},
	validations: {
		payment_dt: {
			payment_price: {
				required,
				integer,
				maxLength: maxLength(7)

			},
			payment_status: {
				required
			},
		}
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
