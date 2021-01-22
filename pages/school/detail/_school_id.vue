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
							詳細画面
						</span>
					</li>
				</ul>
			</div>
		</div>
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<form class="uk-form-horizontal">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>基本情報</span>
							</h4>
							<div class="">
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													学校名
												</th>
												<td>{{ school_dt.organization_name }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													学校名フリガナ
												</th>
												<td>{{ school_dt.organization_name_kana }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													メールアドレス
												</th>
												<td>{{ school_dt.mail_address }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>詳細情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													学校種別
												</th>
												<td>
													{{ school_dt.school_type | view('school_type') }}
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													生徒数
												</th>
												<td>{{ school_dt.student_number }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													HP
												</th>
												<td>{{ school_dt.homepage }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													奨学金情報希望
												</th>
												<td>
													{{ school_dt.scholarship_request | view('scholarship_request') }}
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													インターン情報希望
												</th>
												<td>
													{{ school_dt.internship_request | view('internship_request') }}
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													実習情報希望
												</th>
												<td>
													{{ school_dt.practice_request | view('practice_request') }}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<nuxt-link :to="`/school/edit/${$route.params.school_id}`">
									<input id="form-submit" class="sc-button sc-button-secondary waves-effect waves-button waves-light" type="submit" value="編集">
								</nuxt-link>
							</div>
						</form>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	components: {
	},
	data: () => ({
		school_dt: ""
	}),
	computed: {
	},
	async asyncData ( {app, params, error} ) {
		let { data } = await app.$axios.get(`/api/school/${params.school_id}`)
			.catch((e) =>  {
			})
		return { school_dt: data }
	},
};
</script>
