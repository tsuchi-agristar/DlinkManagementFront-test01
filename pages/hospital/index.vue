<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								病院一覧
							</ScCardTitle>
						</div>
						<div>
							<nuxt-link to="/hospital/edit" class="sc-button sc-button-secondary">
								追加
							</nuxt-link>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="hospital_dtlists"
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
							enabled: false,
						}"
						:sort-options="{
							enabled: true,
							initialSortBy: {field: 'updated_at', type: 'desc'}
						}"
					>
						<template slot="table-row" slot-scope="props">
							<div v-if="props.column.field === 'homepage'">
								<div v-if="props.column.field === 'homepage'">
									<div v-if="!props.row.homepage" class="uk-text-center">
										-
									</div>
									<a v-else class="md-bg-white flexcenter sc-button sc-button-outline waves-effect waves-button sc-button-mini" :href="props.row.homepage" target="_blank">
										<p class="urltxt">URL</p><span class="urltxt uk-margin-small-left uk-icon"><i class="mdi mdi-link-variant sc-icon-18"></i></span>
									</a>
								</div>
								<div v-else>
								</div>
							</div>
							<span v-else-if="props.column.field === 'hospital_type'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
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
													<nuxt-link :to="`/hospital/detail/${props.row.organization_id}`"><span>詳細</span></nuxt-link>
												</li>
												<li>
													<nuxt-link :to="`/hospital/edit/${props.row.organization_id}`"><span>編集</span></nuxt-link>
												</li>
												<li>
													<a href="#modal-header-footer" data-uk-toggle @click="setDialogValue(props.row)"><span>削除</span></a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</span>
							<span v-else-if="props.column.field === 'updated_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD HH:mm:ss") }}
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
					<p>{{ dialogValue.organization_name }}を削除しますか</p>
				</div>
				<div class="uk-modal-footer uk-text-center">
					<button type="button" class="sc-button sc-button-flat uk-modal-close">
						キャンセル
					</button>
					<button class="sc-button sc-button-danger waves-effect waves-button waves-light uk-modal-close" @click="deleteHospital(dialogValue.organization_id)">
						削除
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
			default: '項目を削除しました',
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
					label: '病院名',
					field: 'organization_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '病院名',
					}
				},
				{
					label: '病院名フリガナ',
					field: 'organization_name_kana',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: 'ビョウインメイ',
					}
				},
				{
					label: '病院種別',
					field: 'hospital_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("hospital_type")
					}
				},
				{
					label: '住所',
					field: 'address',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '住所',
					}
				},
				{
					label: 'HP',
					field: 'homepage',
					thClass: 'bghover01 pointer',
					sortable: false,
					filterOptions: {
						enabled: false,
					}
				},
				{
					label: 'メールアドレス',
					field: 'mail_address',
					thClass: 'bghover01 pointer',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: 'example@example.co.jp',
					}
				},
				{
					label: '更新日',
					field: 'updated_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01...',
					}
				}
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/hospital`);
		return {
			hospital_dtlists: data
		}
	},
	methods: {
		async deleteHospital (organization_id) {
			let res;
			res = await this.$axios.delete(`/api/hospital/${organization_id}`);
			if (res.error) {
				UIkit.notification("失敗しました", { status: 'danger' });
			} else {
				await this.getHospital();
				UIkit.notification("削除しました");
			}
		},
		async getHospital () {
			let { data, error } = await this.$axios.get(`/api/hospital`);
			if (error) {
			} else {
				this.hospital_dtlists = data;
			}
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
