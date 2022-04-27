export const constant = {
    cycleWithDates: [{
            startDate: '-01-01',
            endDate: '-12-31'
        },
        {
            startDate: '-01-01',
            endDate: '-03-31'
        },
        {
            startDate: '-04-01',
            endDate: '-06-30'
        },
        {
            startDate: '-07-01',
            endDate: '-09-30'
        },
        {
            startDate: '-10-01',
            endDate: '-12-31'
        },
    ],
    cycleItems: [{
            dbformat: '/1000',
            title: "全部周期"
        },
        {
            dbformat: '/0',
            title: "年度"
        },
        {
            dbformat: '/1',
            title: "第一季度",
            startDate: '/01/01',
            endDate: '/03/31'
        },
        {
            dbformat: '/2',
            title: "第二季度",
            startDate: '/04/01',
            endDate: '/06/30'
        },
        {
            dbformat: '/3',
            title: "第三季度",
            startDate: '/07/01',
            endDate: '/10/30'
        },
        {
            dbformat: '/4',
            title: "第四季度",
            startDate: '/10/01',
            endDate: '/12/31'
        },
        {
            dbformat: '-1',
            title: "1月",
            startDate: '/01/01',
            endDate: '/01/31'
        },
        {
            dbformat: '-2',
            title: "2月",
            startDate: '/02/01',
            endDate: '/02/28'
        },
        {
            dbformat: '-3',
            title: "3月",
            startDate: '/03/01',
            endDate: '/03/31'
        },
        {
            dbformat: '-4',
            title: "4月",
            startDate: '/04/01',
            endDate: '/04/30'
        },
        {
            dbformat: '-5',
            title: "5月",
            startDate: '/05/01',
            endDate: '/05/31'
        },
        {
            dbformat: '-6',
            title: "6月",
            startDate: '/06/01',
            endDate: '/06/30'
        },
        {
            dbformat: '-7',
            title: "7月",
            startDate: '/07/01',
            endDate: '/07/31'
        },
        {
            dbformat: '-8',
            title: "8月",
            startDate: '/08/01',
            endDate: '/08/31'
        },
        {
            dbformat: '-9',
            title: "9月",
            startDate: '/09/01',
            endDate: '/09/30'
        },
        {
            dbformat: '-10',
            title: "10月",
            startDate: '/10/01',
            endDate: '/10/31'
        },
        {
            dbformat: '-11',
            title: "11月",
            startDate: '/11/01',
            endDate: '/11/30'
        },
        {
            dbformat: '-12',
            title: "12月",
            startDate: '/12/01',
            endDate: '/12/31'
        }
    ],
    statusItems: [{
            dbformat: '',
            title: "全部状态"
        },
        {
            dbformat: 0,
            title: "进行中"
        },
        {
            dbformat: 1,
            title: "已结束"
        },
    ],
    libraryArray: [{}, ],
    visibilityTypeArr: [{
            title: '全公司',
            dbformat: 0
        },
        {
            title: '仅相关成员',
            dbformat: 1
        },
        {
            title: '仅直接下属',
            dbformat: 2
        },
        {
            title: '指定范围',
            dbformat: 3
        }
    ],
    taskStatus: [{
            icon: 'mdi-check',
            text: '已完成',
            value: 1
        },
        {
            icon: 'mdi-timer-sand-empty',
            text: '进行中',
            value: 2
        },
        {
            icon: 'mdi-close',
            text: '已取消',
            value: 3
        },
        {
            icon: 'mdi-clock-outline',
            text: '已延迟',
            value: 4
        },
        {
            icon: 'mdi-pause',
            text: '暂停中',
            value: 5
        },
        {
            icon: 'mdi-checkbox-blank-outline',
            text: '未开始',
            value: 6
        }
    ],
    taskVisibility : [
        {
            icon: "mdi-lock-open",
            text: '公开',
            value: 0,
        },
        {
            icon: "mdi-lock",
            text: '部门可见',
            value: 1,
        },
        {
            icon: "mdi-lock",
            text: '仅相关成员可见',
            value: 2,
        }
    ],
    palette: [
        'red', 'yellow', 'blue', 'green', 'gray'
    ],
    yearList: [
        { title: '全部年份', dbformat: 'all' },
        { title: 2012 + '年', dbformat: 2012 },
        { title: 2013 + '年', dbformat: 2013 },
        { title: 2014 + '年', dbformat: 2014 },
        { title: 2015 + '年', dbformat: 2015 },
        { title: 2016 + '年', dbformat: 2016 },
        { title: 2017 + '年', dbformat: 2017 },
        { title: 2018 + '年', dbformat: 2018 },
        { title: 2019 + '年', dbformat: 2019 },
        { title: 2020 + '年', dbformat: 2020 },
        { title: 2021 + '年', dbformat: 2021 },
        { title: 2022 + '年', dbformat: 2022 },
        { title: 2023 + '年', dbformat: 2023 },
        { title: 2024 + '年', dbformat: 2024 },
        { title: 2025 + '年', dbformat: 2025 },
        { title: 2026 + '年', dbformat: 2026 },
        { title: 2027 + '年', dbformat: 2027 },
        { title: 2028 + '年', dbformat: 2028 },
        { title: 2029 + '年', dbformat: 2029 },
        { title: 2030 + '年', dbformat: 2030 },
        { title: 2031 + '年', dbformat: 2031 },
        { title: 2032 + '年', dbformat: 2032 },
        { title: 2033 + '年', dbformat: 2033 },
        { title: 2034 + '年', dbformat: 2034 },
        { title: 2035 + '年', dbformat: 2035 },
        { title: 2036 + '年', dbformat: 2036 },
        { title: 2037 + '年', dbformat: 2037 },
        { title: 2038 + '年', dbformat: 2038 },
        { title: 2039 + '年', dbformat: 2039 },
        { title: 2040 + '年', dbformat: 2040 }
    ],
    years: [
        2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030
    ],
    months: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
    ],
    weeks: [
        "第1周",
        "第2周",
        "第3周",
        "第4周",
        "第5周",
        "第6周"
    ],
    pageCount: 10,
    items_cycles: [
        { state: "每天", abbr: "每天", id: "everyday" },
        { state: "每个工作日", abbr: "每个工作日", id: "everWorkingDay" },
        { state: "每周", abbr: "每周", subState: [{ state: '周一' }, { state: '周二' }, { state: '周三' }, { state: '周四' }, { state: '周五' }, { state: '周六' }, { state: '周日' }, ] },
        {
            state: "每月",
            abbr: "每月",
            subState: [
                { state: "1" }, { state: "2" }, { state: "3" }, { state: "4" }, { state: "5" }, { state: "6" }, { state: "7" }, { state: "8" }, { state: "9" }, { state: "10" },
                { state: "11" }, { state: "12" }, { state: "13" }, { state: "14" }, { state: "15" }, { state: "16" }, { state: "17" }, { state: "18" }, { state: "19" }, { state: "20" },
                { state: "21" }, { state: "22" }, { state: "23" }, { state: "24" }, { state: "25" }, { state: "26" }, { state: "27" }, { state: "28" }, { state: "29" }, { state: "30" },
                { state: "31" },
            ]
        },
        { state: "今天", abbr: "今天", id: "now" },
        { state: "明天", abbr: "明天", id: "tomorrow" },
        { state: "本周六", abbr: "本周六", id: "saturday" },
        { state: "本周日", abbr: "本周日", id: "sunday" },
        { state: "下周一", abbr: "下周一", id: "nextMonday" },
        { state: "下周二", abbr: "下周二", id: "nextTuesday" },
        { state: "下周三", abbr: "下周三", id: "nextWednesday" },
        { state: "其它日期", abbr: "其它日期", id: "other" },
    ],
    items_hours: [
        { state: "00", abbr: "00" },
        { state: "01", abbr: "01" },
        { state: "02", abbr: "02" },
        { state: "03", abbr: "03" },
        { state: "04", abbr: "04" },
        { state: "05", abbr: "05" },
        { state: "06", abbr: "06" },
        { state: "07", abbr: "07" },
        { state: "08", abbr: "08" },
        { state: "09", abbr: "09" },
        { state: "10", abbr: "10" },
        { state: "11", abbr: "11" },
        { state: "12", abbr: "12" },
        { state: "13", abbr: "13" },
        { state: "14", abbr: "14" },
        { state: "15", abbr: "15" },
        { state: "16", abbr: "16" },
        { state: "17", abbr: "17" },
        { state: "18", abbr: "18" },
        { state: "19", abbr: "19" },
        { state: "20", abbr: "20" },
        { state: "21", abbr: "21" },
        { state: "22", abbr: "22" },
        { state: "23", abbr: "23" },
    ],
    items_minutes: [
        { state: "00", abbr: "00" },
        { state: "05", abbr: "05" },
        { state: "10", abbr: "10" },
        { state: "15", abbr: "15" },
        { state: "20", abbr: "20" },
        { state: "25", abbr: "25" },
        { state: "30", abbr: "30" },
        { state: "35", abbr: "35" },
        { state: "40", abbr: "40" },
        { state: "45", abbr: "45" },
        { state: "50", abbr: "50" },
        { state: "55", abbr: "55" },
    ],
    priority: [{
            text: '最高',
            color: 'red'
        },
        {
            text: '高',
            color: 'yellow'
        },
        {
            text: '中',
            color: 'blue'
        },
        {
            text: '低',
            color: 'green'
        },
        {
            text: '非常低',
            color: 'gray'
        },
    ],
    taskStatus: [{
            icon: 'mdi-check',
            text: '已完成',
            value: 1
        },
        {
            icon: 'mdi-timer-sand-empty',
            text: '进行中',
            value: 2
        },
        {
            icon: 'mdi-close',
            text: '已取消',
            value: 3
        },
        {
            icon: 'mdi-clock-outline',
            text: '已延迟',
            value: 4
        },
        {
            icon: 'mdi-pause',
            text: '暂停中',
            value: 5
        },
        {
            icon: 'mdi-checkbox-blank-outline',
            text: '未开始',
            value: 6
        }
    ],
    dayOfWeek: [
        {
            id: 0,
            value: "星期日"
        },
        {
            id: 1,
            value: "周一"
        },
        {
            id: 2,
            value: "周二"
        },
        {
            id: 3,
            value: "周三"
        },
        {
            id: 4,
            value: "周四"
        },
        {
            id: 5,
            value: "星期五"
        },
        {
            id: 6,
            value: "周六"
        }
    ],
    visibleRange: [
        {
            id: 1,
            value: "仅相关成员"
        },
        {
            id: 2,
            value: "仅部门可见"
        },
        {
            id: 3,
            value: "全公司"
        }
    ],
    weekValue: [
        {
            id: 1,
            value: "第1周"
        },
        {
            id: 2,
            value: "第2周"
        },
        {
            id: 3,
            value: "第3周"
        },
        {
            id: 4,
            value: "第4周"
        },
        {
            id: 5,
            value: "第5周"
        },
        {
            id: 6,
            value: "第6周"
        }
    ],
    monthDays: [
        {month: 1, days: 31},
        {month: 2, days: 28},
        {month: 3, days: 31},
        {month: 4, days: 30},
        {month: 5, days: 31},
        {month: 6, days: 30},
        {month: 7, days: 31},
        {month: 8, days: 31},
        {month: 9, days: 30},
        {month: 10, days: 31},
        {month: 11, days: 30},
        {month: 12, days: 31},

    ],
    startForDay: [
        {dayOfWeek: 0, start: 2},
        {dayOfWeek: 1, start: 1},
        {dayOfWeek: 2, start: 7},
        {dayOfWeek: 3, start: 6},
        {dayOfWeek: 4, start: 5},
        {dayOfWeek: 5, start: 4},
        {dayOfWeek: 6, start: 3},
    ]
}