import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Ongeldig emailadres")
    .required("Email is verplicht"),
  password: Yup.string()
    .min(6, "Minstens 6 tekens")
    .required("Password is verplicht"),
});

export default function LoginScreen({ navigation, setIsAuthenticated }: any) {
return (
  <Formik
    initialValues={{ email: "", password: "" }}
    validationSchema={loginSchema}
    onSubmit={async (values) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        setIsAuthenticated(true);
      } catch (e) {
        console.log("Login error:", e);
      }
    }}
  >
    {({ handleChange, handleSubmit, values, errors, touched, handleBlur }) => (
      <View style={globalStyles.container}>
        <Text style={globalStyles.titleText}>Login</Text>

        <TextInput
          placeholder="Email"
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
        />
        {touched.email && errors.email ? <Text>{errors.email}</Text> : null}

        <TextInput
          placeholder="Password"
          value={values.password}
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          secureTextEntry
          style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
        />
        {touched.password && errors.password ? <Text>{errors.password}</Text> : null}

        <TouchableOpacity onPress={() => handleSubmit()}>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    )}
  </Formik>
);
}
