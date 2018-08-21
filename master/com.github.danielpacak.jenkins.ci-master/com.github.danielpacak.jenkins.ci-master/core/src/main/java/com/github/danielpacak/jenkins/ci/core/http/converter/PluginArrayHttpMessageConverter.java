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

import com.github.danielpacak.jenkins.ci.core.Plugin;
import com.github.danielpacak.jenkins.ci.core.http.HttpInputMessage;
import com.github.danielpacak.jenkins.ci.core.http.HttpOutputMessage;
import com.github.danielpacak.jenkins.ci.core.util.XmlResponse;

public class PluginArrayHttpMessageConverter implements HttpMessageConverter<Plugin[]> {

   @Override
   public boolean canRead(Class<?> clazz) {
      return Plugin[].class.equals(clazz);
   }

   @Override
   public boolean canWrite(Class<?> clazz) {
      return false;
   }

   @Override
   public Plugin[] read(Class<? extends Plugin[]> clazz, HttpInputMessage inputMessage) throws IOException {
      XmlResponse xml = new XmlResponse(inputMessage.getBody());
      final Integer count = xml.evaluateAsInteger("count(//plugin)");
      Plugin[] plugins = new Plugin[count];
      for (int i = 0; i < count; i++) {
         final String prefix = "/*/plugin[" + (i + 1) + "]";
         // @formatter:off
         plugins[i] = new Plugin()
            .setActive(xml.evaluateAsBoolean(prefix + "/active"))
            .setBundled(xml.evaluateAsBoolean(prefix + "/bundled"))
            .setDeleted(xml.evaluateAsBoolean(prefix + "/deleted"))
            .setDowngradable(xml.evaluateAsBoolean(prefix + "/downgradable"))
            .setEnabled(xml.evaluateAsBoolean(prefix + "/enabled"))
            .setHasUpdate(xml.evaluateAsBoolean(prefix + "/hasUpdate"))
            .setPinned(xml.evaluateAsBoolean(prefix + "/pinned"))
            .setShortName(xml.evaluateAsString(prefix + "/shortName"))
            .setLongName(xml.evaluateAsString(prefix + "/longName"))
            .setUrl(xml.evaluateAsString(prefix +"/url"))
            .setVersion(xml.evaluateAsString(prefix + "/version"));
         // @formatter:on
      }

      return plugins;
   }

   @Override
   public void write(Plugin[] t, String contentType, HttpOutputMessage outputMessage) throws IOException {
      throw new UnsupportedOperationException();
   }

}
