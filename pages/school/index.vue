<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								学校一覧
							</ScCardTitle>
						</div>
						<div>
							<nuxt-link to="/school/edit" class="sc-button sc-button-secondary">
								追加
							</nuxt-link>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="school_dtlists"
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
							<span v-else-if="props.column.field === 'school_type'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'student_number'">
								{{ props.formattedRow[props.column.field] | formatNumber }}
							</span>
							<span v-else-if="props.column.field === 'scholarship_request' || props.column.field === 'internship_request' || props.column.field === 'practice_request'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'updated_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo(("YYYY/MM/DD HH:mm:ss")) }}
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
													<nuxt-link :to="`/school/detail/${props.row.organization_id}`"><span>詳細</span></nuxt-link>
												</li>
												<li>
													<nuxt-link :to="`/school/edit/${props.row.organization_id}`"><span>編集</span></nuxt-link>
												</li>
												<li>
													<a href="#modal-header-footer" data-uk-toggle @click="setDialogValue(props.row)"><span>削除</span></a>
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
					<button class="sc-button sc-button-danger waves-effect waves-button waves-light uk-modal-close" @click="deleteSchool(dialogValue.organization_id)">
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
		dialogValue: '',
		school_dtlists: "",
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
					label: '学校名',
					field: 'organization_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '学校名',
					}
				},
				{
					label: '学校名フリガナ',
					field: 'organization_name_kana',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: 'ガッコウメイ',
					}
				},
				{
					label: '学校種別',
					field: 'school_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("school_type")
					}
				},
				{
					label: '住所',
					field: 'address',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '住所',
					}
				},
				{
					label: 'HP',
					field: 'homepage',
					sortable: false,
					filterOptions: {
						enabled: false,
					}
				},
				{
					label: 'メールアドレス',
					field: 'mail_address',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: 'aaa@email.com',
					}
				},
				{
					label: '生徒数',
					field: 'student_number',
					thClass: 'bghover01 pointer',
					type: 'number',
					filterOptions: {
						enabled: false,
					}
				},
				{
					label: '奨学金',
					field: 'scholarship_request',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("scholarship_request")
					}
				},
				{
					label: 'インターン',
					field: 'internship_request',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("internship_request")
					}
				},
				{
					label: '実習',
					field: 'practice_request',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("practice_request")
					}
				},
				{
					label: '更新日',
					field: 'updated_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
					}
				}
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/school`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { school_dtlists: data }
	},
	// mounted () {
	// 	this.getSchool()
	// },
	methods: {
		async deleteSchool (organization_id) {
			let res;
			res = await this.$axios.delete(`/api/school/${organization_id}`);
			if (res.error) {
				UIkit.notification("失敗しました", { status: 'danger' });
			} else {
				await this.getSchool();
				UIkit.notification("削除しました");
			}
		},
		async getSchool () {
			let { data, error } = await this.$axios.get(`/api/school`);
			if (error) {
			} else {
				this.school_dtlists = data;
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
