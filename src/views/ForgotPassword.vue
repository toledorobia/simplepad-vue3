<template>
  <div class="container">
    <div class="row vh-100 justify-content-center align-items-center">
      <div class="col-md-4">
        <h1 class="text-center mb-5">Simplepad</h1>
        <p class="text-center">Please enter your email address to request a password reset.</p>

        <div class="form-floating mb-3">
          <input type="email" id="email" class="form-control" placeholder="name@example.com" v-model.trim="email" :disabled="isSubmitting" />
          <label for="email">Email address</label>
          <div class="form-text text-danger">{{ emailError }}</div>
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100 mt-3" v-on:click="onSubmit">Reset Password</button>

        <div class="mt-2 text-center">
          <router-link to="/sign-in">Back</router-link>
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
import { toastError, toastInfo } from "../libs/toast";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const schema = yup.object({
      email: yup.string().required().email().label("Email"),
    });

    const { handleSubmit, isSubmitting } = useForm({
      validationSchema: schema,
    });

    const { value: email, errorMessage: emailError } = useField("email");
    const onSubmit = handleSubmit(async (values) => {
      try {
        await store.dispatch("forgotPassword", values);
        toastInfo("Password reset email sent, check your inbox.");
        router.replace("/sign-in");
      }
      catch (e) {
        toastError(e);
      }
    });

    return {
      email,
      emailError,
      isSubmitting,
      onSubmit,
    };
  },
};
</script>

