import { AsyncStorage } from 'react-native';
const functions =  {
	get_token : async function(){
		const token  = await AsyncStorage.getItem('@authentication_save:verified_auth_token');
		return token;
	}
}

export default functions;