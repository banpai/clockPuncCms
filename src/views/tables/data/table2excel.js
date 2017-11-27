import util from '@/libs/util';
export const excelColumns = [
  {
    title: '名称',
    key: 'nickname',
    render: (h, params) => {
        return h('div', [
            h('Icon', {
                props: {
                    type: 'person'
                }
            }),
            h('strong', params.row.nickname)
        ]);
    }
},
{
    title: '性别',
    key: 'sex',
    render: (h, params) => {
        var sexName = '男';
        if(params.row.sex == 0){
          sexName = '女';
        }
        return h('div', [
            h('strong', sexName)
        ]);
    }
},
{
    title: '国籍',
    key: 'country'
},
{
    title: '省份',
    key: 'province'
},
{
    title: '城市',
    key: 'city'
},
{
    title: '加入时间',
    key: 'createTime'
},
{
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    render: (h, params) => {
        return h('div', [
            h('Button', {
                props: {
                    type: 'primary',
                    size: 'small'
                },
                style: {
                    marginRight: '5px'
                },
                on: {
                    click: () => {
                      // alert(JSON.stringify(params))
                        this.show(params.index)

                    }
                }
            }, '打卡记录'),
            h('Button', {
                props: {
                    type: 'error',
                    size: 'small'
                },
                on: {
                    click: () => {
                        alert(JSON.stringify(params))
                    }
                }
            }, '好友')
        ]);
    }
}
];
