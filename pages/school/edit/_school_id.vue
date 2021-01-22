<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/school/">
							学校一覧
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
									<div class="uk-width-1-2@m" uk-first-column>
										<div class="uk-form-controls">
											<label class="uk-form-label" for="organization_name"><span class="contact_label required">必須</span>学校名</label>
											<ScInput
												id="organization_name"
												v-model="$v.school_dt.organization_name.$model"
												:error-state="$v.school_dt.organization_name.$error"
												:validator="$v.school_dt.organization_name"
												placeholder="学校名"
												mode="outline"
											>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.organization_name.required">
													必須項目です
												</li>
												<li v-if="!$v.school_dt.organization_name.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m">
										<label class="uk-form-label" for="organization_name_kana"><span class="contact_label required">必須</span>学校名フリガナ</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name_kana"
												v-model="$v.school_dt.organization_name_kana.$model"
												:error-state="$v.school_dt.organization_name_kana.$error"
												:validator="$v.school_dt.organization_name_kana"
												placeholder="ガッコウメイ"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.organization_name_kana.required">
													必須項目です
												</li>
												<li v-if="!$v.school_dt.organization_name_kana.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="prefecture"><span class="contact_label required">必須</span>住所</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="prefecture"
													v-model="$v.school_dt.prefecture.$model"
													class="uk-select2"
													:error-state="$v.school_dt.prefecture.$error"
													:validator="$v.school_dt.prefecture"
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
											</client-only>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.prefecture.required">
													必須項目です
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div>
											<div class="uk-form-controls">
												<ScInput
													id="city"
													v-model="$v.school_dt.city.$model"
													:error-state="$v.school_dt.city.$error"
													:validator="$v.school_dt.city"
													placeholder="市区町村"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.school_dt.city.required">
														必須項目です
													</li>
													<li v-if="!$v.school_dt.city.maxLength">
														入力可能桁数を超過しています
													</li>
												</ul>
											</div>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div>
											<div class="uk-form-controls">
												<ScInput
													id="address"
													v-model="$v.school_dt.address.$model"
													:error-state="$v.school_dt.address.$error"
													:validator="$v.school_dt.address"
													placeholder="町名番地"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.school_dt.address.required">
														必須項目です
													</li>
													<li v-if="!$v.school_dt.address.maxLength">
														入力可能桁数を超過しています
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="homepage"><span class="contact_label">任意</span>HP</label>
										<div class="uk-form-controls">
											<ScInput
												id="homepage"
												v-model="$v.school_dt.homepage.$model"
												:error-state="$v.school_dt.homepage.$error"
												:validator="$v.school_dt.homepage"
												placeholder="https//example.com"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.homepage.url">
													形式が正しくありません
												</li>
												<li v-if="!$v.school_dt.homepage.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="mail_address"><span class="contact_label required">必須</span>メールアドレス</label>
										<div class="uk-form-controls">
											<ScInput
												id="mail_address"
												v-model="$v.school_dt.mail_address.$model"
												:error-state="$v.school_dt.mail_address.$error"
												:validator="$v.school_dt.mail_address"
												placeholder="info@example.jp"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.mail_address.required">
													必須項目です
												</li>
												<li v-if="!$v.school_dt.mail_address.email">
													形式が正しくありません
												</li>
												<li v-if="!$v.school_dt.mail_address.maxLength">
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
												v-model="$v.school_dt.dummy.$model"
												:error-state="$v.school_dt.dummy.$error"
												:validator="$v.school_dt.dummy"
												class="p-switch"
												color="danger"
											>
												{{ school_dt.dummy ? '有効' : '無効' }}
											</PrettyCheck>
										</div>
									</div>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>認証情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-2@m uk-first-column">
										<label class="uk-form-label" for="user_id"><span class="contact_label required">必須</span>ユーザーID</label>
										<div class="uk-form-controls">
											<ScInput
												id="user_id"
												v-model="$v.school_dt.account_name.$model"
												:error-state="$v.school_dt.account_name.$error"
												:validator="$v.school_dt.account_name"
												placeholder="0000"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.account_name.required">
													必須項目です
												</li>
												<li v-if="!$v.school_dt.account_name.minLength">
													{{ $v.school_dt.account_name.$params.minLength.min }}文字以上入力してください
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m">
										<label class="uk-form-label" for="user_pass"><span class="contact_label required">必須</span>ユーザーパスワード</label>
										<div class="uk-form-controls">
											<ScInput
												id="user_pass"
												v-model="$v.school_dt.password.$model"
												:error-state="$v.school_dt.password.$error"
												:validator="$v.school_dt.password"
												:type="inputType"
												placeholder="0000"
												mode="outline"
											>
												<span class="pass_eye_wrap">
													<span :class="iconType" @click="onClick">
														<i :class="iconTypeEye" class="mdi"></i>
													</span>
												</span>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.password.required">
													必須項目です
												</li>
												<li v-if="!$v.school_dt.password.minLength">
													{{ $v.school_dt.password.$params.minLength.min }}文字以上入力してください
												</li>
											</ul>
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
										<label class="uk-form-label" for="school_type"><span class="contact_label">任意</span>学校種別</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="school_type"
													v-model="$v.school_dt.school_type.$model"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
													mode="outline"
												>
													<option
														v-for="data in schoolType"
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
										<label class="uk-form-label" for="student_number"><span class="contact_label">任意</span>生徒数</label>
										<div class="uk-form-controls">
											<ScInput
												id="student_number"
												v-model="$v.school_dt.student_number.$model"
												:error-state="$v.school_dt.student_number.$error"
												:validator="$v.school_dt.student_number"
												placeholder="0000"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.school_dt.student_number.integer">
													数字を入力してください
												</li>
												<li v-if="!$v.school_dt.student_number.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="scholarship_request"><span class="contact_label">任意</span>奨学金情報希望</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="scholarship_request"
													v-model="$v.school_dt.scholarship_request.$model"
													class="uk-select2"
													mode="outline"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in request"
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
										<label class="uk-form-label" for="internship_request"><span class="contact_label">任意</span>インターン情報希望</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="internship_request"
													v-model="$v.school_dt.internship_request.$model"
													class="uk-select2"
													mode="outline"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in request"
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
										<label class="uk-form-label" for="practice_request"><span class="contact_label">任意</span>実習情報希望</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="practice_request"
													v-model="$v.school_dt.practice_request.$model"
													class="uk-select2"
													mode="outline"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in request"
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
							</div>
							<div></div>
							<div class="uk-margin-large-top uk-text-center">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[{'sc-button-progress': btnLoading} , [ isNothingInput === false ? 'sc-button-secondary' : 'sc-button-disabled' ]]"
									:disabled="isNothingInput"
									@click.prevent="saveSchool()"
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

import { validationMixin } from "vuelidate";
import { required, email, minLength, maxLength, url, integer } from "vuelidate/lib/validators";
import { CONST } from "~/const.js";

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
		isChecked: false,
		pristine_school_dt: null,
		school_dt: {
			organization_name: '',
			organization_name_kana: '',
			prefecture: [],
			city: '',
			address: '',
			mail_address: '',
			account_name: '',
			password: ''
		}
	}),
	computed: {
		inputType: function () {
    	  return this.isChecked ? "text" : "password";
		},
		iconType: function () {
			return this.isChecked ? "eye_slash" : "eye";
		},
		iconTypeEye: function () {
			return this.isChecked ? "mdi-eye" : "mdi-eye-off";
		},
		schoolType () {
			return CONST.getCode("school_type");
		},
		request () {
			return CONST.getCode("practice_request");
		},
		prefecture_list () {
			return CONST.prefecture_list;
		},
		isNothingInput () {
			if(this.school_dt.organization_name === '' ||
				this.school_dt.organization_name_kana === '' ||
				this.school_dt.prefecture === 0 ||
				this.school_dt.city === '' ||
				this.school_dt.address === '' ||
				this.school_dt.mail_address === '' ||
				this.school_dt.account_name === '' ||
				this.school_dt.password === '') {
				return true;
			}
			return false
		}
	},
	async asyncData ({ app, params, error }) {
		let school_dt = {
			organization_id: null,
			organization_name: '',
			organization_name_kana: '',
			prefecture: [],
			city: '',
			address: '',
			mail_address: '',
			school_id: null,
			school_type: null,
			student_number: null,
			homepage: null,
			scholarship_request: null,
			internship_request: null,
			practice_request: null,
			user_id: null,
			account_name: '',
			password: '',
			dummy: false
		}
		// 編集
		if (params.school_id) {
			let { data, error } = await app.$axios.get(
				`/api/school/${params.school_id}`
			);
			if (error) {
				return { school_dt: school_dt };
			} else {
				return { school_dt: Object.assign(school_dt, data) };
			}
		}
		return { school_dt: school_dt };
	},
	mounted () {
		this.pristine_school_dt = _.cloneDeep(this.school_dt);
	},
	methods: {
		onClick: function () {
			this.isChecked = !this.isChecked;
		},
		async saveSchool () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			// 更新
			if (this.do_update || this.$route.params.school_id) {
				res = await this.$axios.put(`/api/school`, {
					organization_id: this.school_dt.organization_id,
					user_id: this.school_dt.user_id,
					organization: {
						organization_name: this.school_dt.organization_name !== this.pristine_school_dt.organization_name ? this.school_dt.organization_name : null,
						organization_name_kana: this.school_dt.organization_name_kana !== this.pristine_school_dt.organization_name_kana ? this.school_dt.organization_name_kana : null,
						prefecture: this.school_dt.prefecture !== this.pristine_school_dt.prefecture ? this.school_dt.prefecture : null,
						city: this.school_dt.city !== this.pristine_school_dt.city ? this.school_dt.city : null,
						address: this.school_dt.address !== this.pristine_school_dt.address ? this.school_dt.address : null,
						homepage: this.school_dt.homepage !== this.pristine_school_dt.homepage ? this.school_dt.homepage : null,
						dummy: this.school_dt.dummy !== this.pristine_school_dt.dummy ? this.school_dt.dummy : null,
					},
					school: {
						hospital_type: this.school_dt.hospital_type !== this.pristine_school_dt.hospital_type ? this.school_dt.hospital_type : null,
						school_type: this.school_dt.school_type !== this.pristine_school_dt.school_type ? this.school_dt.school_type : null,
						student_number: this.school_dt.student_number !== this.pristine_school_dt.student_number ? this.school_dt.student_number : null,
						scholarship_request: this.school_dt.scholarship_request !== this.pristine_school_dt.scholarship_request ? this.school_dt.scholarship_request : null,
						internship_request: this.school_dt.internship_request !== this.pristine_school_dt.internship_request ? this.school_dt.internship_request : null,
						practice_request: this.school_dt.practice_request !== this.pristine_school_dt.practice_request ? this.school_dt.practice_request : null,
					},
					user: {
						mail_address: this.school_dt.mail_address !== this.pristine_school_dt.mail_address ? this.school_dt.mail_address : null,
						account_name: this.school_dt.account_name !== this.pristine_school_dt.account_name ? this.school_dt.account_name : null,
						password: this.school_dt.password !== this.pristine_school_dt.password ? this.school_dt.password : null,
					}
				});
			}
			// 登録
			else {
				res = await this.$axios.post(`/api/school`, this.school_dt);
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
		async getSchool (organization_id) {
			let { data, error } = await this.$axios.get(
				`/api/school/${organization_id}`
			);
			if (error) {
			} else {
				Object.assign(this.school_dt, data);
				this.pristine_school_dt = _.cloneDeep(this.school_dt);
			}
		}
	},
	validations: {
		school_dt: {
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
			mail_address: {
				required,
				maxLength: maxLength(128),
				email
			},
			school_type: {
			},
			student_number: {
				maxLength: maxLength(7),
				integer
			},
			homepage: {
				maxLength: maxLength(128),
				url
			},
			scholarship_request: {
			},
			internship_request: {
			},
			practice_request: {
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
			}
		}
	}
};
</script>
<style lang="scss">
	@import '~scss/vue/_pretty_checkboxes';
</style>
