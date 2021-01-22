<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								請求一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="payment_dtlists"
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
							<span v-if="props.column.field === 'payment_status'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'payment_price'">
								{{ props.formattedRow[props.column.field] | formatCurrency('JPY') }}
							</span>
							<span v-else-if="props.column.field === 'action'">
								<div data-uk-margin>
									<div class="uk-inline">
										<button class="md-bg-white sc-button sc-button-icon sc-button-outline sc-button-mini" type="button">
											<span data-uk-icon="cog" class="w14"></span>
										</button>
										<div data-uk-dropdown pos="top-left">
											<ul class="uk-nav uk-dropdown-nav">
												<li>
													<nuxt-link :to="`/payment/detail/${props.row.payment_id}`"><span>詳細</span></nuxt-link>
												</li>
												<li>
													<nuxt-link :to="`/payment/edit/${props.row.payment_id}`"><span>編集</span></nuxt-link>
												</li>
												<!-- <li>
													<a href="#modal-header-footer" data-uk-toggle @click="setDialogValue(props.row.organization_name)"><span>請求確定</span></a>
												</li> -->
											</ul>
										</div>
									</div>
								</div>
							</span>
							<span v-else-if="props.column.field === 'payment_month'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM") }}
							</span>
							<span v-else-if="props.column.field === 'payment_price'">
								{{ props.formattedRow[props.column.field] | formatCurrency('JPY') }}
							</span>
							<template v-else>
								{{ props.formattedRow[props.column.field] }}
							</template>
						</template>
					</VueGoodTable>
				</ScCardBody>
			</ScCard>
		</div>
		<div id="modal-header-footer" class="uk-modal" data-uk-modal>
			<div class="uk-modal-dialog">
				<button class="uk-modal-close-default" type="button" data-uk-close></button>
				<div class="uk-modal-body">
					<p>{{ dialogValue }}の請求内容を確定しますか</p>
				</div>
				<div class="uk-modal-footer uk-text-center">
					<button type="button" class="sc-button sc-button-flat uk-modal-close">
						キャンセル
					</button>
					<button class="sc-button sc-button-secondary uk-modal-close" @click="showNotification(notification.default)">
						確定
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { CONST } from '~/const.js';

export default {
	components: {
		VueGoodTable
	},
	data: () => ({
		notification: {
			default: '請求内容を確定しました',
		},
		dialogValue: ''
	}),
	computed: {
		columns () {
			return [
				{
					label: '操作',
					field: 'action',
					sortable: false,
					tdClass: 'uk-text-nowrap',
				},
				{
					label: '請求月',
					field: 'payment_month',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020年1月',
					}
				},
				{
					label: '病院名',
					field: 'organization_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '病院名',
					}
				},
				{
					label: '請求金額',
					field: 'payment_price',
					type: 'number',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '1,000,000',
					}
				},
				{
					label: '請求状態',
					field: 'payment_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("payment_status")
					}
				}
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/payment`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { payment_dtlists: data }
	},
	methods: {
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
		setDialogValue (value) {
			this.dialogValue = value;
		}
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
