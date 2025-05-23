import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ListItem, Avatar } from 'react-native-elements'
import { Text } from 'react-native-elements';
import axios from 'axios';
import { TextInput } from 'react-native-web';

function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <Avatar
        size="xlarge"
        icon={{ name: 'user', type: 'font-awesome' }}
        rounded
        source={{
          uri:
            'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        }}
      />

      <Input placeholder='LOGIN' />

      <Input placeholder="SENHA" secureTextEntry={true} />

      <Button title="Login" onPress={() => navigation.navigate('ListaContato')} buttonStyle={styles.button} />
      <Button title="Cadastre-se" onPress={() => navigation.navigate('CadastroUser')} buttonStyle={styles.button2} />
      <Button title="Esqueceu a senha"
        type="clear"
        onPress={() => navigation.navigate('RecuperarSenha')}
      />
    </View>
  );
}

function ListaContatos({ navigation }) {
  const [lista, setLista] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:3000/contatos')
      .then(response => setLista(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <View style={styles.container2}>
      {
        lista.map((l, i) => (
          <ListItem key={i} bottomDivider onPress={() => navigation.navigate("Contato", { id: l.id, nome: l.nome, email: l.email, telefone: l.telefone })}>
            <Avatar source={{ uri: l.avatar_url }} />
            <ListItem.Content>
              <ListItem.Title>{l.nome}</ListItem.Title>
              <ListItem.Subtitle>{l.telefone}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))
      }
    </View>
  );
}

function CadastroUser({ navigation }) {
  const [nome, setNome] = React.useState('');
  const [cpf, setCpf] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const salvarUsuario = () => {
    axios.post('http://localhost:3000/usuarios', {
      nome: nome,
      cpf: cpf,
      email: email,
      senha: senha
    }).then(function (response) {
      console.log("Contato salvo: ", response.data);
      navigation.navigate('Login');
    }).catch(function (error) {
      console.log("Erro ao salvar o contato:", error);
    });
  };

  return (
    <View style={styles.container}>

      <Text h4>Nome do usuário: </Text>
      <TextInput style={styles.box} placeholder='Ex: Maria' value={nome} onChangeText={setNome} />

      <Text h4>CPF do usuário: </Text>
      <TextInput style={styles.box} placeholder='Ex: 111.222.333-44' value={cpf} onChangeText={setCpf} />

      <Text h4>E-mail do usuário: </Text>
      <TextInput style={styles.box} placeholder='Ex: maria@example.com' value={email} onChangeText={setEmail} />

      <Text h4>Senha do usuário: </Text>
      <TextInput style={styles.box} value={senha} onChangeText={setSenha} />

      <Button title="Salvar" buttonStyle={styles.button} onPress={salvarUsuario} />

    </View>
  );
}

function CadastroContato({ navigation }) {
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [telefone, setTelefone] = React.useState('');

  const salvarContato = () => {
    axios.post('http://localhost:3000/contatos', {
      nome: nome,
      email: email,
      telefone: telefone
    }).then(function (response) {
      console.log("Contato salvo: ", response.data);
      navigation.navigate('ListaContato');
    }).catch(function (error) {
      console.log("Erro ao salvar o contato:", error);
    });
  };

  return (
    <View style={styles.container}>

      <Text h4>Nome do contato: </Text>
      <TextInput style={styles.box} placeholder='Ex: Maria' value={nome} onChangeText={setNome} />

      <Text h4>E-mail do contato: </Text>
      <TextInput style={styles.box} placeholder='Ex: maria@example.com' value={email} onChangeText={setEmail} />

      <Text h4>Número do contato: </Text>
      <TextInput style={styles.box} placeholder='Ex: 81 911112222' value={telefone} onChangeText={setTelefone} />

      <Button title="Salvar" buttonStyle={styles.button} onPress={salvarContato} />

    </View>
  );
}

function RecuperarSenha() {
  return (
    <View style={styles.container}>

      <Input placeholder='E-MAIL' />

      <Button title="Enviar" buttonStyle={styles.button} />

    </View>
  );
}

function Contato({ route, navigation }) {
  const { id, nome, email, telefone } = route.params;

  const deletarContato = () => {
    axios.delete(`http://localhost:3000/contatos/${id}`)
      .then(() => {
        Alert.alert("Sucesso", "Contato excluído!");
        navigation.goBack();
      }).catch(error => {
        console.log("Erro ao excluir o contato: ", error);
        Alert.alert("Erro", "Não foi possível excluir o contato.");
      });
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.caixa}>NOME</Text>
      <Text h4>{nome}</Text>
      <Text h4 style={styles.caixa}>E-MAIL</Text>
      <Text h4>{email}</Text>
      <Text h4 style={styles.caixa}>TELEFONE</Text>
      <Text h4>{telefone}</Text>

      <Button title="Alterar" onPress={() => navigation.navigate('AlterarContato', { id, nome, email, telefone })} buttonStyle={styles.button} />

      <Button title="Excluir" buttonStyle={styles.button2} onPress={(deletarContato)} />

    </View>
  );
}

function AlterarContato({ route, navigation }) {
  const { id, nome, email, telefone } = route.params;

  const [nome2, setNome2] = React.useState(nome);
  const [email2, setEmail2] = React.useState(email);
  const [telefone2, setTelefone2] = React.useState(telefone);

  const alterarContato = () => {
    axios.put(`http://localhost:3000/contatos/${id}`, {
      nome: nome2,
      email: email2,
      telefone: telefone2
    })
      .then(() => {
        Alert.alert("Sucesso", "Contato alterado!");
        navigation.navigate('ListaContato');
      }).catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>

      <Text h4>Novo nome: </Text>
      <TextInput style={styles.box} placeholder='Ex: Maria' value={nome2} onChangeText={setNome2} />

      <Text h4>Novo E-mail: </Text>
      <TextInput style={styles.box} placeholder='Ex: maria@example.com' value={email2} onChangeText={setEmail2} />

      <Text h4>Novo número: </Text>
      <TextInput style={styles.box} placeholder='Ex: 81 911112222' value={telefone2} onChangeText={setTelefone2} />

      <Button title="Enviar" buttonStyle={styles.button} onPress={(alterarContato)} />

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  button: {
    backgroundColor: 'black',
    width: 200,
  },
  button2: {
    backgroundColor: 'red',
    width: 200,
  },
  container2: {
    flex: 1,
    padding: 20,
  },
  caixa: {
    backgroundColor: '#d1d1d1',
    color: "black",
    width: 300,
    padding: 10,
  },
  box: {
    backgroundColor: "#d1d1d1",
    color: '#000',
    width: 300,
    height: 50,
    padding: 5
  }
});

const Stack = createNativeStackNavigator();

function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />

        <Stack.Screen name="ListaContato" component={ListaContatos} options={({ navigation }) => ({ headerRight: () => (<Ionicons name="add" size={24} color="black" style={{ marginRight: 10 }} onPress={() => navigation.navigate('NovoContato')} />), })} />

        <Stack.Screen name="CadastroUser" component={CadastroUser} options={{ headerTitleAlign: 'center', }} />

        <Stack.Screen name="NovoContato" component={CadastroContato} options={{ headerTitleAlign: 'center', }} />

        <Stack.Screen name="Contato" component={Contato} options={{ headerTitleAlign: 'center', }} />

        <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} options={{ headerTitleAlign: 'center', }} />

        <Stack.Screen name="AlterarContato" component={AlterarContato} options={{ headerTitleAlign: 'center', }} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;