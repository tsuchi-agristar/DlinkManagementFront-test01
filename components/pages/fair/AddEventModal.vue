<template>
	<modal
		name="modal-add-event"
		:draggable="$device.isDesktop"
		:adaptive="true"
		:reset="true"
		width="50%"
		height="auto"
		@before-open="beforeOpen"
		@before-close="beforeClose"
	>
		<div class="uk-card uk-form-stacked">
			<div class="uk-padding-small uk-padding-remove-bottom flexmiddle">
				<div class="vm--title uk-card-title">
				</div>
				<button
					type="button"
					class="close-button"
					@click="hide()"
				>
					<span class="mdi mdi-close"></span>
				</button>
			</div>
			<div class="uk-padding-small">
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-1@m uk-first-column">
						<label class="uk-form-label" for="event_type">
							<span class="contact_label required">必須</span>イベント種別
						</label>
						<div class="uk-form-controls">
							<client-only>
								<Select2
									id="event_type"
									v-model="$v.event_dt.event_type.$model"
									:error-state="$v.event_dt.event_type.$error"
									:validator="$v.event_dt.event_type"
									class="uk-select2 "
									:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
								>
									<option
										v-for="data in eventType"
										:key="data.value"
										:value="data.value"
									>
										{{ data.text }}
									</option>
								</Select2>
								<ul class="sc-vue-errors">
									<li v-if="!$v.event_dt.event_type.required">
										必須項目です
									</li>
								</ul>
							</client-only>
						</div>
					</div>
				</div>
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-1@m uk-first-column">
						<label class="uk-form-label" for="fair_format">
							<span class="contact_label required">必須</span>開催期間
						</label>
						<div class="uk-form-controls uk-margin-small-top">
							<div class="uk-grid" data-uk-grid>
								<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
									<ScInput
										id="event_start_at"
										v-model="$v.event_dt.event_start_at.$model"
										v-flatpickr="dpTimePicker"
										:error-state="$v.event_dt.event_start_at.$error"
										:validator="$v.event_dt.event_start_at"
										mode="outline"
									>
										<label>開始日時</label>
									</ScInput>
									<ul class="sc-vue-errors">
										<li v-if="!$v.event_dt.event_start_at.required">
											必須項目です
										</li>
									</ul>
								</div>
								<div class="flexmiddle uk-margin-small-top date_tilde_height">
									~
								</div>
								<div class="uk-width-2-5@s uk-margin-small-top ">
									<ScInput
										id="event_end_at"
										v-model="$v.event_dt.event_end_at.$model"
										v-flatpickr="dpTimePicker"
										:error-state="$v.event_dt.event_end_at.$error"
										:validator="$v.event_dt.event_end_at"
										mode="outline"
									>
										<label>終了日時</label>
									</ScInput>
									<ul class="sc-vue-errors">
										<li v-if="!$v.event_dt.event_end_at.required">
											必須項目です
										</li>
										<li v-if="!$v.event_dt.event_end_at.validatePlanAt">
											開始日/終了日の整合性が正しくありません
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="uk-padding-small uk-text-center">
				<button
					v-waves.button.light
					class="sc-button sc-button-secondary"
					:class="{'sc-button-progress': btnLoading}"
					:disabled="btnLoading"
					@click.prevent="saveEvent()"
				>
					<span v-if="!btnLoading">登録</span>
					<ScProgressCircular v-else light></ScProgressCircular>
				</button>
			</div>
		</div>
	</modal>
</template>
<script>
import ScInput from '~/components/ui/Input'
import { ScProgressCircular } from "~/components/ui/progress";
import { Japanese } from "flatpickr/dist/l10n/ja.js"
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import { CONST } from "~/const.js";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import _ from 'lodash';
const validatePlanAt = (value, vm) => (vm.event_start_at < vm.event_end_at);
if(process.client) {
	require('~/plugins/flatpickr');
}
export default {
	name: 'AddEventModal',
	components: {
		ScInput,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		fair_dt: null,
		event_dt: {
			event_type: null,
			event_start_at: null,
			event_end_at: null
		},
		Japanese,
	}),
	computed: {
		eventType () {
			return CONST.getCode("event_type").filter((dt) => dt.value != CONST.event_type.INDIVIDUAL.value);
		},
		dpTimePicker () {
			const self = this;
	    	return {
				locale: self.Japanese,
				enableTime: true,
				time_24hr: true,
				plugins: [new confirmDatePlugin({
					confirmIcon: "<i class='mdi mdi-check'></i>",
					confirmText: ""
				})],
				dateFormat: "Y-m-d H:i:00",
				minDate: 'today'
			}
		},
	},
	mounted () {
	},
	methods: {
		hide () {
			this.$modal.hide('modal-add-event');
		},
		beforeOpen (event) {
			this.fair_dt = event.params;
			this.event_dt.event_type = null;
			this.event_dt.event_start_at = null;
			this.event_dt.event_end_at = null;
			this.$nextTick(() => { this.$v.$reset() });
		},
		beforeClose (event) {
		},
		async saveEvent () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}
			let res;
			this.btnLoading = true;
			this.event_dt.fair_id = this.fair_dt.fair_id;
			res = await this.$axios.post(`/api/event`, this.event_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
          		await this.$emit('update');
				UIkit.notification("登録しました");
				this.hide();

			}
			this.btnLoading = false;
		},
	},
	validations: {
		event_dt: {
			event_type: {
				required
			},
			event_start_at: {
				required,
			},
			event_end_at: {
				required,
				validatePlanAt
			},
		}
	}
}
</script>

<style scoped lang="scss">
</style>
