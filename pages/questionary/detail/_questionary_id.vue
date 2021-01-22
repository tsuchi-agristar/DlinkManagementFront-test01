<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/questionary/">
							アンケート一覧
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
							<div>
								<div class="uk-overflow-auto">
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													病院名
												</th>
												<td>
													organization_name
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													病院名フリガナ
												</th>
												<td>
													organization_name_kana
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													住所
												</th>
												<td>
													full_address
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													HP
												</th>
												<td>
													homepage
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													メールアドレス
												</th>
												<td>
													mail_address
												</td>
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
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													病院種別
												</th>
												<td>
													hospital_type
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<nuxt-link :to="`/questionary/`">
									<input id="form-submit" class="sc-button sc-button-primary waves-effect waves-button waves-light" type="submit" value="アンケート一覧へ">
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
		hospital_dt: ""
	}),
	async asyncData ( {app, params, error} ) {
		let { data } = await app.$axios.get(`/api/questionary/${params.hospital_id}`)
			.catch((e) =>  {
			})
		return { hospital_dt: data }
	},
}
</script>
