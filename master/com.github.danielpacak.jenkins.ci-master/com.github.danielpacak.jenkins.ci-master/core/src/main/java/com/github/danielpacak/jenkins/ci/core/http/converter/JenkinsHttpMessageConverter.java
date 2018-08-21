/*
 * #%L
 * Jenkins Java API
 * %%
 * Copyright (C) 2013 Daniel Pacak
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package com.github.danielpacak.jenkins.ci.core.http.converter;

import java.io.IOException;

import com.github.danielpacak.jenkins.ci.core.Jenkins;
import com.github.danielpacak.jenkins.ci.core.http.HttpInputMessage;
import com.github.danielpacak.jenkins.ci.core.http.HttpOutputMessage;
import com.github.danielpacak.jenkins.ci.core.util.XmlResponse;

public class JenkinsHttpMessageConverter implements HttpMessageConverter<Jenkins> {

   @Override
   public boolean canRead(Class<?> clazz) {
      return Jenkins.class.equals(clazz);
   }

   @Override
   public boolean canWrite(Class<?> clazz) {
      return false;
   }

   @Override
   public Jenkins read(Class<? extends Jenkins> clazz, HttpInputMessage inputMessage) throws IOException {
      XmlResponse xml = new XmlResponse(inputMessage.getBody());
      // @formatter:off
      return new Jenkins()
         .setMode(Jenkins.MODE.valueOf(xml.evaluateAsString("/*/mode")))
         .setNodeDescription(xml.evaluateAsString("/*/nodeDescription"))
         .setNodeName(xml.evaluateAsString("/*/nodeName"))
         .setNumExecutors(xml.evaluateAsInteger("/*/numExecutors"))
         .setUseSecurity(xml.evaluateAsBoolean("/*/useSecurity"));
      // @formatter:on
   }

   @Override
   public void write(Jenkins t, String contentType, HttpOutputMessage outputMessage) throws IOException {
      throw new UnsupportedOperationException();
   }

}
