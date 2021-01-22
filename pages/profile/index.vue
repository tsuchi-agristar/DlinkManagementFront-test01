<template>
	<div id="sc-page-wrapper">
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
										<label class="uk-form-label" for="organization_name">
											<span class="contact_label required">必須</span>組織名
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name"
												v-model="$v.profile_dt.organization_name.$model"
												:error-state="$v.profile_dt.organization_name.$error"
												:validator="$v.profile_dt.organization_name"
												placeholder="組織名"
												mode="outline"
											>
											</ScInput>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-first-column">
										<label class="uk-form-label" for="organization_name_kana">
											<span class="contact_label required">必須</span>組織名フリガナ
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name_kana"
												v-model="$v.profile_dt.organization_name_kana.$model"
												:error-state="$v.profile_dt.organization_name_kana.$error"
												:validator="$v.profile_dt.organization_name_kana"
												placeholder="ソシキメイ"
												mode="outline"
											>
											</ScInput>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="address"><span class="contact_label required">必須</span>住所</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="prefecture"
													v-model="$v.profile_dt.prefecture.$model"
													class="uk-select2"
													:error-state="$v.profile_dt.prefecture.$error"
													:validator="$v.profile_dt.prefecture"
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
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div class="uk-first-column ">
											<ScInput
												id="city"
												v-model="$v.profile_dt.city.$model"
												:error-state="$v.profile_dt.city.$error"
												:validator="$v.profile_dt.city"
												placeholder="市区町村"
												mode="outline"
											></ScInput>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div class="uk-first-column ">
											<ScInput
												id="address"
												v-model="$v.profile_dt.address.$model"
												:error-state="$v.profile_dt.address.$error"
												:validator="$v.profile_dt.address"
												placeholder="町名番地"
												mode="outline"
											>
											</ScInput>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="homepage"><span class="contact_label required">必須</span>HP</label>
										<div class="uk-form-controls">
											<ScInput
												id="homepage"
												v-model="$v.profile_dt.homepage.$model"
												:error-state="$v.profile_dt.homepage.$error"
												:validator="$v.profile_dt.homepage"
												placeholder="https//example.com"
												mode="outline"
											></ScInput>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="mail_address">
											<span class="contact_label required">必須</span>メールアドレス
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="mail_address"
												v-model="$v.profile_dt.mail_address.$model"
												:error-state="$v.profile_dt.mail_address.$error"
												:validator="$v.profile_dt.mail_address"
												placeholder="info@example.jp"
												mode="outline"
											></ScInput>
										</div>
									</div>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[{'sc-button-progress': btnLoading},[ inputDiff === false ? 'sc-button-secondary' : 'sc-button-disabled' ]]"
									:disabled="btnLoading || inputDiff"
									@click.prevent="saveProfile()"
								>
									<span v-if="!btnLoading">変更</span>
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
import ScInput from '~/components/ui/Input'
import ScTextarea from '~/components/ui/Textarea'
import { ScProgressCircular } from "~/components/ui/progress";
import { CONST } from "~/const.js";
import { validationMixin } from "vuelidate";
import { required, email, minLength, maxLength, url, integer } from "vuelidate/lib/validators";
export default {
	components: {
		ScInput,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
	}),
	computed: {
		prefecture_list () {
			return CONST.prefecture_list;
		},
		inputDiff () {
			return _.isEqual(this.pristine_profile_dt, this.profile_dt)
		},
	},
	async asyncData ( {app, params, store} ) {
		let profile_dt = {
			organization_id: null,
			organization_name: null,
			organization_name_kana: null,
			prefecture: null,
			city: null,
			address: null,
			mail_address: null,
			homepage: null,
		}
		let { data, error } = await app.$axios.get(`/api/profile`);
		if (error) {
			return { profile_dt: profile_dt };
		} else {
			return {
				profile_dt: Object.assign(profile_dt, data),
				pristine_profile_dt: _.cloneDeep(profile_dt)
			 };
		}
	},
	methods: {
		async saveProfile () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			res = await this.$axios.put(`/api/profile`, this.profile_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
				await this.getProfile ();
				UIkit.notification("登録しました");
			}
			this.btnLoading = false;
		},
		async getProfile () {
			let { data, error } = await this.$axios.get(`/api/profile`);
			if (error) {
			} else {
				Object.assign(this.profile_dt, data);
				this.pristine_profile_dt = _.cloneDeep(this.profile_dt);
			}
		},
	},
	validations: {
		profile_dt: {
			organization_name:{
				required,
				maxLength: maxLength(128)
			},
			organization_name_kana:{
				required,
				maxLength: maxLength(128)
			},
			prefecture:{
				required
			},
			city:{
				required,
				maxLength: maxLength(32)
			},
			address:{
				required,
				maxLength: maxLength(128)
			},
			homepage:{
				maxLength: maxLength(128),
				url
			},
			mail_address:{
				required,
				maxLength: maxLength(128),
				email
			},
		}
	}
}
</script>
