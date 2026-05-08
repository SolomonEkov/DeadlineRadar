import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { Formik } from "formik";
import * as Yup from "yup";
import { globalStyles } from "../../styles/global";

const registerSchema = Yup.object({
  email: Yup.string()
    .email("Ongeldig emailadres")
    .required("Email is verplicht"),
  password: Yup.string()
    .min(6, "Minstens 6 tekens")
    .required("Password is verplicht"),
});

export default function RegisterScreen({ navigation }: any) {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={registerSchema}
      onSubmit={async (values) => {
        try {
          await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password,
          );
          navigation.navigate("Login");
        } catch (e) {
          console.log(e);
        }
      }}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        handleBlur,
      }) => (
        <View>
          <Text>Register</Text>

          <TextInput
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            style={{
              borderWidth: 1,
              padding: 10,
              width: 250,
              marginVertical: 10,
            }}
          />
          {touched.email && errors.email ? <Text>{errors.email}</Text> : null}

          <TextInput
            placeholder="Password"
            value={values.password}
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            style={{
              borderWidth: 1,
              padding: 10,
              width: 250,
              marginVertical: 10,
            }}
          />
          {touched.password && errors.password ? (
            <Text>{errors.password}</Text>
          ) : null}

          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text>Create account</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
}
