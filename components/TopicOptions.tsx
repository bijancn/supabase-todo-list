import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { addOptions } from "../lib/OptionsDao";
import { Topic } from "../lib/TopicsDao";
import React from "react";

const initialValues = {
  options: [
    {
      title: "",
    },
    {
      title: "",
    },
  ],
};

const sendOptions = async (userId, topicId, values) => {
  await new Promise((r) => setTimeout(r, 500));
  const result = await addOptions(userId, topicId, values);
  alert(JSON.stringify(result));
};

interface TopicOptionsProps {
  topic: Topic;
  userId: string;
}

export default function TopicOptions(props: TopicOptionsProps) {
  return (
    <>
      <Box boxShadow="" p="6" rounded="md" bg="white">
        <Heading fontSize={{ base: "xl", sm: "2xl", md: "4xl" }}>
          <p>Possible options for</p>
          <Text color="#e53e3e">{props.topic.title}</Text>
          <p>are</p>
        </Heading>
        <Formik
          initialValues={initialValues}
          onSubmit={(formValue, actions) => {
            sendOptions(props.userId, props.topic.id, formValue.options);
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <FieldArray name="options">
                {({ insert, remove, push }) => (
                  <div>
                    {props.values.options.length > 0 &&
                      props.values.options.map((friend, index) => (
                        <div className="row" key={index}>
                          <Field name={`options.${index}.title`}>
                            {({ field, form }) => (
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={
                                    index == 0
                                      ? "First option"
                                      : index == 1
                                      ? "Second option"
                                      : "Optional extra options"
                                  }
                                  aria-label={"Your Option"}
                                  size="lg"
                                  variant="flushed"
                                />
                                <FormErrorMessage>
                                  {form.errors.name}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </div>
                      ))}
                    {props.values.options.every(
                      (value, index) => value.title.length > 0
                    ) &&
                      push({
                        title: "",
                      })}
                  </div>
                )}
              </FieldArray>
              <Center>
                <Button
                  mt={4}
                  colorScheme="red"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Publish
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
}
