import React from 'react';

const RoomList = (props) => {
  const orderedRooms = [...props.rooms.sort((a, b) => a.id - b.id)];

  return (
    <div className="rooms-list">
      <h3>Your rooms: </h3>
      <ul>
        {orderedRooms.map(room => {
          const active = props.roomId === room.id ? 'active' : '';

          return (
            <li key={room.id} className={"room " + active}>
              <a onClick={() => props.subscribeToRoom(room.id)}
                    href="#"># {room.name}</a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RoomList;