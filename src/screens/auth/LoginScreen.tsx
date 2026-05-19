import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firestore/FirebaseConfig";
import { StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "../../components/AuthHeader";

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await signInWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password,
                );
                setIsAuthenticated(true);
              } catch (e: any) {
                console.log("Login error:", e);
                setSubmitting(false);
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
              isSubmitting,
            }) => (
              <View style={styles.wrapper}>
                <AuthHeader
                  title="Deadline Radar"
                  subtitle="Beheer je deadlines met gemak"
                />

                <View style={styles.formSection}>
                  <Text style={styles.formTitle}>Welkom terug</Text>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.label}>E-mailadres</Text>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#CBD5E1"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isSubmitting}
                      style={[
                        styles.input,
                        touched.email && errors.email && styles.inputError,
                      ]}
                    />
                    {touched.email && errors.email ? (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Wachtwoord</Text>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="#CBD5E1"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry
                      editable={!isSubmitting}
                      style={[
                        styles.input,
                        touched.password &&
                          errors.password &&
                          styles.inputError,
                      ]}
                    />
                    {touched.password && errors.password ? (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      isSubmitting && styles.buttonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    activeOpacity={0.8}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>Inloggen</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.registerLink}
                    onPress={() => navigation.navigate("Register")}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.registerText}>
                      Nog geen account?{" "}
                      <Text style={styles.registerLinkText}>Registreren</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  wrapper: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  headerSection: {
    alignItems: "center",
    marginBottom: 56,
  },

  logo: {
    fontSize: 56,
    marginBottom: 12,
  },

  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.8,
  },

  tagline: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },

  formSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },

  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 28,
    textAlign: "center",
  },

  inputWrapper: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
  },

  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 4,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 24,
  },

  registerLink: {
    alignItems: "center",
    justifyContent: "center",
  },

  registerText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },

  registerLinkText: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
