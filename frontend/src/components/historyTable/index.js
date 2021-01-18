import React from 'react';
import { Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { selectRobot } from '../../stores/robotSlice';
import dayjs from 'dayjs';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags) => (
      <>
        {tags.map((tag) => {
          let color = '';
          if (tag === 'start') {
            color = 'green';
          } else if (tag === 'place') {
            color = 'pink';
          } else if (tag === 'repair') {
            color = 'orange';
          } else if (tag === 'done') {
            color = 'gray';
          } else if (tag === 'reset') {
            color = 'geekblue';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

export const HistoryTable = () => {
  const robotStateSlice = useSelector(selectRobot);
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    const commands = robotStateSlice.commands;
    const data = [];
    for (let i = 0; i < commands.length; i++) {
      let obj = {};
      obj.id = Number(i);
      obj.key = i;
      obj.tags = [commands[i].command];
      obj.timestamp = dayjs(JSON.parse(commands[i].timestamp)).format(
        'MM/DD/YYYY HH:mm:ss'
      );
      data.push(obj);
    }

    setTableData(data);
  }, [robotStateSlice.commands]);

  return <Table columns={columns} dataSource={tableData} />;
};
