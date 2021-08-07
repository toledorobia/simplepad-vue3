<template>
  <div class="container">
    <div class="row vh-100 justify-content-center align-items-center">
      <div class="col-md-4">
        <h1 class="text-center mb-5">Simplepad</h1>

        <div class="form-floating mb-3">
          <input type="email" id="email" class="form-control" placeholder="name@example.com" v-model.trim="email" :disabled="isSubmitting" />
          <label for="email">Email address</label>
          <div class="form-text text-danger">{{ emailError }}</div>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="password" placeholder="Password" v-model.trim="password" :disabled="isSubmitting" />
          <label for="password">Password</label>
          <div class="form-text text-danger">{{ passwordError }}</div>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="password-repeat" placeholder="Repeat password" v-model="passwordRepeat" :disabled="isSubmitting" />
          <label for="password-repeat">Repeat password</label>
          <div class="form-text text-danger">{{ passwordRepeatError }}</div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100 mt-3" v-on:click="onSubmit">Sign Up</button>

        <div class="mt-4 text-center">
          Already have an account?
          <router-link to="/sign-in">Sign In</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from 'vue-router'
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { toastError, toastSuccess } from "../libs/toast";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const schema = yup.object({
      email: yup.string().required().email().label("Email"),
      password: yup.string().required().min(6).label("Password"),
      passwordRepeat: yup.string().required().min(6).label("Repeat password"),
      remember: yup.boolean().default(false).label("Remember me")
    });

    const { handleSubmit, isSubmitting } = useForm({
      validationSchema: schema,
    });

    const { value: email, errorMessage: emailError } = useField("email");
    const { value: password, errorMessage: passwordError } = useField("password");
    const { value: passwordRepeat, errorMessage: passwordRepeatError } = useField("passwordRepeat");

    const onSubmit = handleSubmit(async (values) => {
      try {
        await store.dispatch("signUp", values);
        toastSuccess("Sign up successfully. You need to verify your email address first.");
        router.replace("/sign-in");
      }
      catch (e) {
        toastError(e);
      }
    });

    return {
      email,
      emailError,
      password,
      passwordError,
      passwordRepeat,
      passwordRepeatError,
      isSubmitting,
      onSubmit,
    };
  },
};
</script>

