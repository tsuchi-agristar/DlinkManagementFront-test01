<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/hospital/">
							病院一覧
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
								<span>基本情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-2@m uk-first-column">
										<label class="uk-form-label" for="organization_name"><span class="contact_label required">必須</span>病院名</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name"
												v-model="$v.hospital_dt.organization_name.$model"
												:error-state="$v.hospital_dt.organization_name.$error"
												:validator="$v.hospital_dt.organization_name"
												placeholder="病院名"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.hospital_dt.organization_name.required">
													必須項目です
												</li>
												<li v-if="!$v.hospital_dt.organization_name.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m">
										<label class="uk-form-label" for="organization_name_kana"><span class="contact_label required">必須</span>病院名フリガナ</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name_kana"
												v-model="$v.hospital_dt.organization_name_kana.$model"
												:error-state="$v.hospital_dt.organization_name_kana.$error"
												:validator="$v.hospital_dt.organization_name_kana"
												placeholder="ビョウインメイ"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.hospital_dt.organization_name_kana.required">
													必須項目です
												</li>
												<li v-if="!$v.hospital_dt.organization_name_kana.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-margin">
									<label class="uk-form-label" for="prefecture"><span class="contact_label required">必須</span>住所</label>
									<div class="uk-form-controls">
										<client-only>
											<Select2
												id="prefecture"
												v-model="$v.hospital_dt.prefecture.$model"
												:error-state="$v.hospital_dt.prefecture.$error"
												:validator="$v.hospital_dt.prefecture"
												class="uk-select2 uk-margin-medium-bottom"
												:settings="{ 'width': '100%', 'placeholder': '都道府県', allowClear: true }"
											>
												<option
													v-for="prefecture in prefecture_list"
													:key="prefecture"
													:value="prefecture"
												>
													{{ prefecture }}
												</option>
											</Select2>
											<ul class="sc-vue-errors">
												<li v-if="!$v.hospital_dt.prefecture.required">
													必須項目です
												</li>
											</ul>
										</client-only>
										<div class="uk-child-width-1-2@m uk-grid" data-uk-grid>
											<div class="uk-first-column">
												<ScInput
													id="city"
													v-model="$v.hospital_dt.city.$model"
													:error-state="$v.hospital_dt.city.$error"
													:validator="$v.hospital_dt.city"
													placeholder="市区町村"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.hospital_dt.city.required">
														必須項目です
													</li>
													<li v-if="!$v.hospital_dt.city.maxLength">
														入力可能桁数を超過しています
													</li>
												</ul>
											</div>
											<div class>
												<ScInput
													id="address"
													v-model="$v.hospital_dt.address.$model"
													:error-state="$v.hospital_dt.address.$error"
													:validator="$v.hospital_dt.address"
													placeholder="町名番地"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.hospital_dt.address.required">
														必須項目です
													</li>
													<li v-if="!$v.hospital_dt.address.maxLength">
														入力可能桁数を超過しています
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="mail_address"><span class="contact_label required">必須</span>メールアドレス</label>
										<div class="uk-form-controls">
											<ScInput
												id="mail_address"
												v-model="$v.hospital_dt.mail_address.$model"
												:error-state="$v.hospital_dt.mail_address.$error"
												:validator="$v.hospital_dt.mail_address"
												placeholder="info@example.jp"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.hospital_dt.mail_address.required">
													必須項目です
												</li>
												<li v-if="!$v.hospital_dt.mail_address.email">
													形式が正しくありません
												</li>
												<li v-if="!$v.hospital_dt.mail_address.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="prefecture"><span class="contact_label required">必須</span>ダミー</label>
										<div>
											<PrettyCheck
												v-model="$v.hospital_dt.dummy.$model"
												:error-state="$v.hospital_dt.dummy.$error"
												:validator="$v.hospital_dt.dummy"
												class="p-switch"
												color="danger"
											>
												{{ hospital_dt.dummy ? '有効' : '無効' }}
											</PrettyCheck>
										</div>
									</div>
								</div>
							</div>
							<h4 class="bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>詳細情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="hospital_type"><span class="contact_label">任意</span>病院種別</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="hospital_type"
													v-model="$v.hospital_dt.hospital_type.$model"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1 , allowClear: true }"
												>
													<option
														v-for="data in hospitalType"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="homepage"><span class="contact_label">任意</span>HP</label>
										<div class="uk-form-controls">
											<ScInput
												id="homepage"
												v-model="$v.hospital_dt.homepage.$model"
												:error-state="$v.hospital_dt.homepage.$error"
												:validator="$v.hospital_dt.homepage"
												placeholder="https://example.com"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.hospital_dt.homepage.url">
													形式が正しくありません
												</li>
												<li v-if="!$v.hospital_dt.homepage.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<h4 class="bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>認証情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-2@m uk-first-column">
										<label class="uk-form-label" for="user_id"><span class="contact_label required">必須</span>ユーザーID</label>
										<div class="uk-form-controls">
											<ScInput
												id="user_id"
												v-model="$v.hospital_dt.account_name.$model"
												:error-state="$v.hospital_dt.account_name.$error"
												:validator="$v.hospital_dt.account_name"
												placeholder="0000"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.hospital_dt.account_name.required">
													必須項目です
												</li>
												<li v-if="!$v.hospital_dt.account_name.minLength">
													{{ $v.hospital_dt.account_name.$params.minLength.min }}文字以上入力してください
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m">
										<label class="uk-form-label" for="user_pass"><span class="contact_label required">必須</span>ユーザーパスワード</label>
										<div class="uk-form-controls">
											<ScInput
												id="user_pass"
												v-model="$v.hospital_dt.password.$model"
												:error-state="$v.hospital_dt.password.$error"
												:validator="$v.hospital_dt.password"
												placeholder="0000"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.hospital_dt.password.required">
													必須項目です
												</li>
												<li v-if="!$v.hospital_dt.password.minLength">
													{{ $v.hospital_dt.password.$params.minLength.min }}文字以上入力してください
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[{'sc-button-progress': btnLoading},[ isNothingInput === false ? 'sc-button-secondary' : 'sc-button-disabled' ]]"
									:disabled="btnLoading || isNothingInput"
									@click.prevent="saveHospital()"
								>
									<span v-if="!btnLoading">登録</span>
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
import ScInput from "~/components/ui/Input";
import ScTextarea from "~/components/ui/Textarea";
import { ScProgressCircular } from "~/components/ui/progress";
import PrettyCheck from 'pretty-checkbox-vue/check';

import { CONST } from "~/const.js";
import { validationMixin } from 'vuelidate'
import { required, email, minLength, maxLength, url, integer } from "vuelidate/lib/validators";

import _ from 'lodash';
export default {
	components: {
		ScInput,
		ScProgressCircular,
		Select2: process.client ? () => import("~/components/ui/Select2") : null,
		PrettyCheck,
	},
	mixins: [validationMixin],
	data: () => ({
		do_update: false,
		btnLoading: false,
		pristine_hospital_dt: null,
		hospital_dt: {
			organization_name: '',
			organization_name_kana: '',
			prefecture: [],
			city: '',
			address: '',
			mail_address: '',
			account_name: '',
			password: '',
		}
	}),
	computed: {
		hospitalType () {
			return CONST.getCode("hospital_type");
		},
		prefecture_list () {
			return CONST.prefecture_list;
		},
		isNothingInput () {
			if(this.hospital_dt.organization_name === ''
				|| this.hospital_dt.organization_name_kana === ''
				|| this.hospital_dt.prefecture === 0
				|| this.hospital_dt.city === ''
				|| this.hospital_dt.address === ''
				|| this.hospital_dt.mail_address === ''
				|| this.hospital_dt.account_name === ''
				|| this.hospital_dt.password === '') {
				return true;
			}
			return false;
		},
	},
	async asyncData ({ app, params, error }) {
		let hospital_dt = {
			organization_id: null,
			organization_name: '',
			organization_name_kana: '',
			prefecture: [],
			city: '',
			address: '',
			mail_address: '',
			hospital_id: null,
			hospital_type: null,
			homepage: null,
			user_id: null,
			account_name: '',
			password: '',
			dummy: false
		}
		// 編集
		if (params.hospital_id) {
			let { data, error } = await app.$axios.get(
				`/api/hospital/${params.hospital_id}`
			);
			if (error) {
				return { hospital_dt: hospital_dt };
			} else {
				return { hospital_dt: Object.assign(hospital_dt, data) };
			}
		}
		return { hospital_dt: hospital_dt };
	},
	mounted () {
		this.pristine_hospital_dt = _.cloneDeep(this.hospital_dt);
	},
	methods: {
		async saveHospital () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			// 更新
			if (this.do_update || this.$route.params.hospital_id) {
				res = await this.$axios.put(`/api/hospital`, {
					organization_id: this.hospital_dt.organization_id,
					user_id: this.hospital_dt.user_id,
					organization: {
						organization_name: this.hospital_dt.organization_name !== this.pristine_hospital_dt.organization_name ? this.hospital_dt.organization_name : null,
						organization_name_kana: this.hospital_dt.organization_name_kana !== this.pristine_hospital_dt.organization_name_kana ? this.hospital_dt.organization_name_kana : null,
						prefecture: this.hospital_dt.prefecture !== this.pristine_hospital_dt.prefecture ? this.hospital_dt.prefecture : null,
						city: this.hospital_dt.city !== this.pristine_hospital_dt.city ? this.hospital_dt.city : null,
						address: this.hospital_dt.address !== this.pristine_hospital_dt.address ? this.hospital_dt.address : null,
						homepage: this.hospital_dt.homepage !== this.pristine_hospital_dt.homepage ? this.hospital_dt.homepage : null,
						dummy: this.hospital_dt.dummy !== this.pristine_hospital_dt.dummy ? this.hospital_dt.dummy : null,
					},
					hospital: {
						hospital_type: this.hospital_dt.hospital_type !== this.pristine_hospital_dt.hospital_type ? this.hospital_dt.hospital_type : null,
					},
					user: {
						mail_address: this.hospital_dt.mail_address !== this.pristine_hospital_dt.mail_address ? this.hospital_dt.mail_address : null,
						account_name: this.hospital_dt.account_name !== this.pristine_hospital_dt.account_name ? this.hospital_dt.account_name : null,
						password: this.hospital_dt.password !== this.pristine_hospital_dt.password ? this.hospital_dt.password : null,
					}
				});
			}
			// 登録
			else {
				res = await this.$axios.post(`/api/hospital`, this.hospital_dt);
			}
			if (res.error) {
				// ユーザーIDでエラーとなった場合は、重複である旨のメッセージを表示する
				if (res.error.data && (res.error.data.error.errors.hasOwnProperty('user.account_name') || res.error.data.error.errors.hasOwnProperty('account_name'))) {
					UIkit.notification("失敗しました。ユーザーIDが既に登録済みです", { status: "danger" });
				}
				else {
					UIkit.notification("失敗しました", { status: "danger" });
				}
				this.btnLoading = false;
			} else {
				UIkit.notification("登録しました");
				this.$router.go(-1);
			}
		},
		async getHospital (organization_id) {
			let { data, error } = await this.$axios.get(
				`/api/hospital/${organization_id}`
			);
			if (error) {
			} else {
				Object.assign(this.hospital_dt, data);
				this.pristine_hospital_dt = _.cloneDeep(this.hospital_dt);
			}
		}
	},
	validations: {
		hospital_dt: {
			organization_name: {
				required,
				maxLength: maxLength(128)
			},
			organization_name_kana: {
				required,
				maxLength: maxLength(128)
			},
			prefecture: {
				required
			},
			city: {
				required,
				maxLength: maxLength(32)
			},
			address: {
				required,
				maxLength: maxLength(128)
			},
			hospital_type: {
			},
			mail_address: {
				required,
				maxLength: maxLength(128),
				email
			},
			homepage: {
				maxLength: maxLength(128),
				url
			},
			account_name: {
				required,
				minLength: minLength(6)
			},
			password: {
				required,
				minLength: minLength(6)
			},
			dummy: {
				required,
			}
		}
	}
};
</script>
<style lang="scss">
	@import '~scss/vue/_pretty_checkboxes';
</style>
