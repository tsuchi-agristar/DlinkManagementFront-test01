import { scHelpers, scMq } from "~/assets/js/utils";
const { uniqueID } = scHelpers;

export const menuEntries = [
	{
		section_title: "メニュー"
	},
	// 画像は、ここから探してくる！！！　→　https://iconify.design/icon-sets/mdi/
	{
		id: uniqueID(),
		title: "学校",
		page: "/school",
		icon: "mdi mdi-school-outline",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "病院",
		page: "/hospital",
		icon: "mdi mdi-hospital-box-outline",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "説明会",
		page: "/fair",
		icon: "mdi mdi-google-classroom",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "説明会申込",
		page: "/fair_application",
		icon: "mdi mdi-pencil-box-outline",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "アンケート",
		page: "/questionary",
		icon: "mdi mdi-file-document-box-check-outline",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "チャンネル",
		page: "/channel",
		icon: "mdi mdi-tooltip-account",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "テレビ会議",
		page: "/meeting",
		icon: "mdi mdi-airplay",
		isOpen: false,
		level: 0,
	},
	// version1では不要
	// {
	// 	id: uniqueID(),
	// 	title: "請求",
	// 	page: "/payment",
	// 	icon: "mdi mdi-file-document",
	// 	isOpen: false,
	// 	level: 0,
	// },
	{
		id: uniqueID(),
		title: "通知",
		page: "/notification",
		icon: "mdi mdi-bell",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "病院アクティビティ",
		page: "/hospital_activity",
		icon: "mdi mdi-format-list-bulleted",
		isOpen: false,
		level: 0,
	},
	{
		id: uniqueID(),
		title: "学校アクティビティ",
		page: "/school_activity",
		icon: "mdi mdi-format-list-bulleted-triangle",
		isOpen: false,
		level: 0,
	},
];
