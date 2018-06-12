import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight,
		 Image, BackHandler, TextInput, KeyboardAvoidingView,
		 Platform } from 'react-native';
import { connect } from 'react-redux';

import {  setActiveChat, sendMessage, monitorChat, monitorChatOff } from '../actions/ChatActions'

import { MensagemItem } from '../components/ConversaInterna/MensagemItem';

export class ConversaInterna extends Component {

	static navigationOptions = ({navigation}) => ({
		title:navigation.state.params.title,
		tabBarVisible:false,
		headerLeft:(
			<TouchableHighlight onPress={()=>{navigation.state.params.voltarFunction()}} underlayColor={false}>
				<Image source={require('react-navigation/src/views/assets/back-icon.png')} style={{width:25, height:25, marginLeft:20}} />
			</TouchableHighlight>
		)
	})

	constructor(props) {
		super(props);

		this.state = {
			inputText:''
		};

		console.disableYellowBox = true;
		this.voltar      = this.voltar.bind(this);
		this.sendMsg     = this.sendMsg.bind(this);
		this.chooseImage = this.chooseImage.bind(this);
	}

	componentDidMount(){
		this.props.navigation.setParams({voltarFunction:this.voltar});
		BackHandler.addEventListener('hardwareBackPress', this.voltar);

		this.props.monitorChat(this.props.activeChat);
	}

	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', this.voltar);
	}

	voltar(){
		this.props.monitorChatOff(this.props.activeChat);
		this.props.setActiveChat('');
		this.props.navigation.goBack();

		return true;
	}

	sendMsg(){
		let txt = this.state.inputText;

		let state = this.state;
		state.inputText = '';
		this.setState(state);

		this.props.sendMessage('text' , txt, this.props.uid, this.props.activeChat);
	}

	chooseImage(){
		alert('Selecione sua imagem!!!!!11');
	}

	render() {

		let AreaBehavior = Platform.select({
			ios:'padding',
			android:null
		});

		let Areaoffset = Platform.select({
			ios:64,
			android:null
		});

		return (
			<KeyboardAvoidingView behavior={AreaBehavior} keyboardVerticalOffset={Areaoffset} style={styles.container}>
				<FlatList ref={(ref)=>{ this.chatArea = ref }}
						  onLayout={()=>{ this.chatArea.scrollToEnd({animated:true}) }}
						  onContentSizeChange={ () => {this.chatArea.scrollToEnd({animated:true})} }
						  style={styles.chatArea} 
						  data={this.props.activeChatMessages} 
						  renderItem={({item})=><MensagemItem data={item} me={this.props.uid} />} />
				<View style={styles.sendArea}>
					<TouchableHighlight style={styles.imageButton} onPress={this.chooseImage}>
						<Image style={styles.btmImage} source={require('../assets/images/new_image_3.png')} />
					</TouchableHighlight>
					<TextInput style={styles.sendInput} value={this.state.inputText} onChangeText={(inputText)=>this.setState({inputText})}/>
					<TouchableHighlight style={styles.sendButton} onPress={this.sendMsg}>
						<Image style={styles.sendImage} source={require('../assets/images/send.png')} />
					</TouchableHighlight>
				</View>
			</KeyboardAvoidingView>
		);
	}

}

const styles = StyleSheet.create({
	container:{
		flex:1
	},
	chatArea:{
		flex:1,
		backgroundColor:'#CCCCCC'
	},
	sendArea:{
		height:50,
		backgroundColor:'#EEEEEE',
		flexDirection:'row'
	},
	sendInput:{
		height:50,
		flex:1
	},
	sendButton:{
		width:50,
		height:50,
		justifyContent:'center',
		alignItems:'center'
	},
	imageButton:{
		width:50,
		height:50,
		justifyContent:'center',
		alignItems:'center'
	},
	sendImage:{
		height:40,
		width:40
	},
	btmImage:{
		height:40,
		width:40
	}
});

const mapStateToProps = (state) => {
	return {
		uid:state.auth.uid,
		users:state.chat.users,
		activeChat:state.chat.activeChat,
		activeChatMessages:state.chat.activeChatMessages
	};
};

const ConversaInternaConnect = connect(mapStateToProps, { setActiveChat, sendMessage, monitorChat, monitorChatOff })(ConversaInterna);
export default ConversaInternaConnect;