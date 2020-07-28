import request from '@/utils/request';

//获取日程列表
export function getCalendarList(param){
    return request({
        url: '/admin/schedule/myThings',
        method: 'post',
        data: {calendarDate: param}
    })
}

//添加日程
export function addCalendarThing(param){
    return request({
        url: '/admin/schedule/addThing',
        method: 'post',
        data: {...param}
    })
}

//编辑日程
export function editCalendarThing(param){
    return request({
        url: '/admin/schedule/updateThing',
        method: 'post',
        data: {...param}
    })
}

//获取日程详情
export function getCalendarThingDetails(param){
    return request({
        url: '/admin/schedule/thing',
        method: 'post',
        data: {id: param}
    })
}

//删除日程
export function deleteCalendarThing(param){
    return request({
        url: '/admin/schedule/deleteThing',
        method: 'post',
        data: {id: param}
    })
}