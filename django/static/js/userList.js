// export async function userList() {
//     const response = await fetch('/api/users/');
//     const users = await response.json();
//     const userListElement = document.getElementById('user-list');
//     userListElement.innerHTML = '<h2>User List</h2><ul>' + users.map(user => `
//         <li>
//             ${user.username} (${user.nickname || 'No nickname'}) - Wins: ${user.wins} - Losses: ${user.losses}
//             <img src="${user.avatar_url}" alt="Avatar" style="width: 50px; height: 50px;">
//         </li>
//     `).join('') + '</ul>';
// } 

