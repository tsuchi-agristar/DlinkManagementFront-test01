<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								アンケート一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="questionary_dtlists"
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
							initialSortBy: {field: 'answered_datetime', type: 'desc'}
						}"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'questionaryHospital' || props.column.field === 'questionaryPlace'">
								<div v-for="item in props.formattedRow[props.column.field]" :key="item">
									{{ item }}
								</div>
							</span>
							<span v-else-if="props.column.field === 'hospital_type' || props.column.field === 'fair_type'">
								<div v-for="item in props.formattedRow[props.column.field]" :key="item">
									{{ item | view(props.column.field) }}
								</div>
							</span>
							<span v-else-if="props.column.field === 'answered_datetime' || props.column.field === 'desire_start_at' || props.column.field === 'desire_end_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD") }}
							</span>
							<span v-else-if="props.column.field === 'comment'">
								<div v-if="props.formattedRow[props.column.field]">
									<div v-for="(str,index) in props.formattedRow[props.column.field].split('\n')" :key="index">
										{{ str }}
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
	computed: {
		columns () {
			return [
				{
					label: '学校名',
					field: 'organization_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '学校名',
					}
				},
				{
					label: 'アンケート回答日',
					field: 'answered_datetime',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
					}
				},
				{
					label: '希望説明会種別',
					field: 'fair_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("fair_type"),
						filterFn: this.filterFn
					}
				},
				{
					label: '希望実施開始日',
					field: 'desire_start_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
					}
				},
				{
					label: '希望実施終了日',
					field: 'desire_end_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
					}
				},
				{
					label: '希望病院',
					field: 'questionaryHospital',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '病院名',
					}
				},
				{
					label: '希望地域',
					field: 'questionaryPlace',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.prefecture_list,
						filterFn: this.filterFn
					}
				},
				{
					label: '希望病院種別',
					field: 'hospital_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("hospital_type"),
						filterFn: this.filterFn
					}
				},
				{
					label: 'コメント',
					field: 'comment',
					tdClass: 'uk-text-initial',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: 'コメント',
					}
				}
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/questionary`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		console.log(data)
		return { questionary_dtlists: data }
	},
	methods: {
		filterFn (data, filterString) {
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
