<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								説明会申込
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
							initialSortBy: {field: 'application_datetime', type: 'desc'}
						}"
					>
						<template slot="table-row" slot-scope="props">
							<div v-if="props.column.field === 'application_datetime' || props.column.field === 'plan_start_at' || props.column.field === 'plan_end_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD") }}
							</div>
							<span v-else-if="props.column.field === 'plan_period' || props.column.field === 'plan_start_at' || props.column.field === 'plan_end_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm") }}
							</span>
							<span v-else-if="props.column.field === 'fair_type'">
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
							<span v-else-if="props.column.field === 'action'">
								<div data-uk-margin>
									<div class="uk-inline">
										<button class="md-bg-white sc-button sc-button-icon sc-button-outline sc-button-mini" type="button">
											<span data-uk-icon="cog" class="w14"></span>
										</button>
										<div data-uk-dropdown pos="top-left">
											<ul class="uk-nav uk-dropdown-nav">
												<li>
													<nuxt-link :to="`/fair_application/detail/${props.row.application_id}`"><span>詳細</span></nuxt-link>
												</li>
												<li>
													<nuxt-link :to="`/fair_application/edit/${props.row.application_id}`"><span>編集</span></nuxt-link>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</span>
							<span v-else-if="props.column.field === 'estimate_participant_number'">
								{{ props.formattedRow[props.column.field] | formatNumber }}
							</span>
							<span v-else-if="props.column.field === 'application_status' || props.column.field === 'hospital_type' || props.column.field === 'fair_type' || props.column.field === 'fair_status' || props.column.field === 'fair_format'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<template v-else>
								{{ props.formattedRow[props.column.field] }}
							</template>
						</template>
					</VueGoodTable>
				</ScCardBody>
			</ScCard>
		</div>
	</div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { mapGetters } from 'vuex'
import { CONST } from '~/const.js';

export default {
	components: {
		VueGoodTable
	},
	data: () => ({
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
					label: '学校名',
					field: 'school_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '学校名',
					}
				},
				{
					label: '申込日',
					field: 'application_datetime',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01',
					}
				},
				{
					label: '申込状態',
					field: 'application_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("application_status")
					}
				},
				{
					label: '説明会形式',
					field: 'fair_format',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("fair_format")
					}
				},
				{
					label: '参加予定人数',
					field: 'estimate_participant_number',
					thClass: 'bghover01 pointer',
					type:'number',
					filterOptions: {
						enabled: false,
						placeholder: '100',
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
					label: '説明会状態',
					field: 'fair_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("fair_status")
					}
				},
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/fairApplication`);
		return {
			fair_dtlists: data
		}
	},
	methods: {
		fairTypeFilterFn (data, filterString) {
			return data.some( (val) => {
				return val === filterString;
			})
		}
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>
