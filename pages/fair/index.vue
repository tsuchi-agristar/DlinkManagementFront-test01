<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								説明会一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="fair_dtlists"
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
							<span v-if="props.column.field === 'fair_type'">
								<span
									v-for="(item, index) in props.formattedRow[props.column.field]"
									:key="index"
								>
									<span v-if="item === scholarship" class="uk-label label_type scholarship">奨学金</span>
									<span v-else-if="item === intership" class="uk-label label_type intership">インターン</span>
									<span v-else-if="item === practice" class="uk-label label_type practice">実習</span>
									<span v-else-if="item === info" class="uk-label label_type hospital_fair_type">病院説明</span>
								</span>
							</span>
							<span v-else-if="props.column.field === 'fair_status' || props.column.field === 'event_status' || props.column.field === 'estimate_status'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'start_at' || props.column.field === 'end_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}
							</span>
							<span v-else-if="props.column.field === 'plan_start_at' || props.column.field === 'plan_end_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD") }}
							</span>
							<span v-else-if="props.column.field === 'application_count'">
								{{ props.formattedRow[props.column.field] | formatNumber }}
							</span>
							<span v-else-if="props.column.field === 'estimate_price'">
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
													<nuxt-link :to="`/fair/detail/${props.row.fair_id}${props.row.event_id ? '?event_id='+props.row.event_id : ''}`"><span>詳細</span></nuxt-link>
												</li>
												<li v-if="!cannotEdit(props.row)">
													<nuxt-link :to="`/fair/edit/${props.row.fair_id}${props.row.event_id ? '?event_id='+props.row.event_id : ''}`"><span>編集</span></nuxt-link>
												</li>
												<li v-if="!cannotAddEvent(props.row)">
													<a @click="openAddEventModal(props.row)"><span>イベント追加</span></a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</span>
							<template v-else>
								{{ props.formattedRow[props.column.field] }}
							</template>
						</template>
					</VueGoodTable>
				</ScCardBody>
			</ScCard>
		</div>
		<client-only>
			<AddEventModal
				@update="getFair()"
			>
			</AddEventModal>
		</client-only>
	</div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import AddEventModal from "~/components/pages/fair/AddEventModal.vue";
import { CONST } from '~/const.js';
export default {
	components: {
		VueGoodTable,
		AddEventModal
	},
	data: () => ({
		notification: {
			default: '項目を削除しました',
		},
		dialogValue: '',
		fair_dtlists: "",
	}),
	computed: {
		scholarship () {
			return CONST.fair_type.SCHOLARSHIP.value;
		},
		intership () {
			return CONST.fair_type.INTERSHIP.value;
		},
		practice () {
			return CONST.fair_type.PRACTICE.value;
		},
		info () {
			return CONST.fair_type.INFO.value;
		},
		columns () {
			return [
				{
					label: '操作',
					field: 'action',
					sortable: false,
					tdClass: 'uk-text-nowrap',
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
					label: '開催開始予定日',
					field: 'plan_start_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00'
					}
				},
				{
					label: '開催終了予定日',
					field: 'plan_end_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00'
					}
				},
				{
					label: '説明会種別',
					field: 'fair_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("fair_type"),
						filterFn: this.fairTypeFilterFn
					}
				},
				{
					label: '申込件数',
					field: 'application_count',
					thClass: 'bghover01 pointer',
					type: 'number',
					filterOptions: {
						enabled: false,
						placeholder: '100,0000'
					}
				},
				{
					label: '説明会状態',
					field: 'fair_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("fair_status")
					}
				},
				{
					label: '開始日時',
					field: 'start_at',
					sortable: true,
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00',
					}
				},
				{
					label: '終了日時',
					field: 'end_at',
					sortable: true,
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00',
					}
				},
				{
					label: 'イベント状態',
					field: 'event_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems:  CONST.getCode("event_status")
					}
				},
				{
					label: '見積金額',
					field: 'estimate_price',
					thClass: 'bghover01 pointer',
					type: 'number',
					filterOptions: {
						enabled: false,
						placeholder: '100,0000'
					}
				},
				{
					label: '見積状態',
					field: 'estimate_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems:  CONST.getCode("estimate_status")
					}
				},
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/fair`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { fair_dtlists: data }
	},
	methods: {
		cannotEdit (data) {
			return (data.fair_status === CONST.fair_status.END.value
				 || data.fair_status === CONST.fair_status.CANCEL.value)
				 && !data.event_id
		},
		cannotAddEvent (data) {
			return data.fair_status === CONST.fair_status.CANCEL.value
		},
		openAddEventModal (value) {
			this.$modal.show('modal-add-event', value);
		},
		fairTypeFilterFn (data, filterString) {
			return data.some( (val) => {
				return val === filterString;
			})
		},
		async getFair () {
			let { data, error } = await this.$axios.get(`/api/fair`);
			if (error) {
			} else {
				this.fair_dtlists = data;
			}
		}
	}
}
</script>

<style scoped lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
