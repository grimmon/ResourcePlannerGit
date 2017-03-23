export let CONFIG = {
    urls: {
        authorized: 'api/authorized',
        resources: 'api/resource',
        resourceDetail: 'api/resourcedetail',
        resourceBreakdown: 'api/resourcebreakdown',
        resourceExport: 'api/resource/excelexport',
        requestResource: 'api/email',
        assignmentGet: 'api/assignment/get',
        assignmentAdd: 'api/assignment/add',
        assignmentUpdate: 'api/assignment/update',
        assignmentDelete: 'api/assignment/delete',
        projects: 'api/project/all',
        wbsProjects: 'api/project/wbs',
        projectView: 'api/ProjectView',
        projectAdd: 'api/project/add',
        projectUpdate: 'api/project/update',
        project: 'api/project/get',
        customer: 'api/customer',
        manager: 'api/manager',
        position: 'api/position',
        categoryOptions: 'api/dropdown'
    },
    periodColumnsCount: 8,
    dataHeaders: [
        "RES",
        "FOR",
        "ACT",
        "&#916;"
    ],

    daysOfWeek: [
        { id: '2', text: 'Monday', short: "Mon" },
        { id: '3', text: 'Tuesday', short: "Tue" },
        { id: '4', text: 'Wednesday', short: "Wed" },
        { id: '5', text: 'Thursday', short: "Thu" },
        { id: '6', text: 'Friday', short: "Fri" },
        { id: '7', text: 'Saturday', short: "Sat" },
        { id: '1', text: 'Sunday', short: "Sun" }
    ],
    defaultDaysOfWeek: ['2', '3', '4', '5', '6',],
    defaultHoursPerDay: 8,


};