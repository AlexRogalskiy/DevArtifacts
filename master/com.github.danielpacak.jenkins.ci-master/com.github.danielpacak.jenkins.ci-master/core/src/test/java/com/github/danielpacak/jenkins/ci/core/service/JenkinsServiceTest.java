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
package com.github.danielpacak.jenkins.ci.core.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.github.danielpacak.jenkins.ci.core.Jenkins;
import com.github.danielpacak.jenkins.ci.core.client.JenkinsClient;
import com.github.danielpacak.jenkins.ci.core.service.JenkinsService;

/**
 * Tests for {@link JenkinsService}.
 */
@RunWith(MockitoJUnitRunner.class)
public class JenkinsServiceTest {

   @Mock
   private JenkinsClient client;

   private JenkinsService service;

   @Before
   public void beforeTest() throws Exception {
      service = new JenkinsService(client);
   }

   @Test
   public void getJenkins() throws Exception {
      Jenkins jenkins = new Jenkins();
      when(client.getForObject("/api/xml", Jenkins.class)).thenReturn(jenkins);
      assertEquals(jenkins, service.getJenkins());
   }

}
