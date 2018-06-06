import firebase from '../FirebaseConnection';

export const pegarListaDeUsuarios = ( userUid ) => {
    return (dispatch) => {
		
		firebase.database().ref("users").orderByChild("name").once("value")
		.then((snapshot) => {

			let users = [];
            snapshot.forEach((childItem)=>{
				
				if(childItem.key != userUid){
					users.push({
						key:childItem.key,
						name:childItem.val().name
					});
				}
			});

            dispatch({
                type:'carregarListaDeUsuarios',
                payload:{
                    users:users
                }
			})
		});
		
    };
};

export const createChat = (userUid1, userUid2) => {
	return(dispatch) => {

		//Criando o próprio CHAT
		let newChat = firebase.database().ref('chats').push();
		newChat.child('members').child(userUid1).set({
			id:userUid1
		})
		newChat.child('members').child(userUid2).set({
			id:userUid2
		})

		//Associando aos envolvidos
		let chatId = newChat.key;
		firebase.database().ref('users').child(userUid1).child('chats')
			.child(chatId).set({
				id:chatId
			});

		firebase.database().ref('users').child(userUid2).child('chats')
			.child(chatId).set({
				id:chatId
			});
	}
};