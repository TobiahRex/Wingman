# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Command to set properties."""

from googlecloudsdk.calliope import base
from googlecloudsdk.calliope import exceptions as c_exc
from googlecloudsdk.command_lib.config import completers
from googlecloudsdk.core import log
from googlecloudsdk.core import properties
from googlecloudsdk.core.configurations import named_configs


@base.ReleaseTracks(base.ReleaseTrack.BETA)
class GetValue(base.Command):
  """Print the value of a Cloud SDK property.

  {command} prints the property value from your active configuration only.

  ## AVAILABLE PROPERTIES

  {properties}

  ## EXAMPLES

  To print the project property in the core section, run:

    $ {command} project

  To print the zone property in the compute section, run:

    $ {command} compute/zone
  """

  detailed_help = {'properties': properties.VALUES.GetHelpString()}

  @staticmethod
  def Args(parser):
    """Adds args for this command."""
    property_arg = parser.add_argument(
        'property',
        metavar='SECTION/PROPERTY',
        help='The property to be fetched. Note that `SECTION/` is optional'
        ' while referring to properties in the core section.')
    property_arg.completer = completers.PropertiesCompleter

  def Run(self, args):
    config_name = named_configs.ConfigurationStore.ActiveConfig().name
    log.status.write('Your active configuration is: [{0}]\n\n'.format(
        config_name))

    section, prop = properties.ParsePropertyString(args.property)
    if not prop:
      if section:
        err_msg = ('You cannot call get-value on a SECTION/. '
                   'Did you mean `gcloud config list SECTION`?')
        raise c_exc.InvalidArgumentException('property', err_msg)
      raise c_exc.InvalidArgumentException(
          'property', 'Must be in the form: [SECTION/]PROPERTY')
    try:
      value = properties.VALUES.Section(section).Property(prop).Get(
          validate=True)
      if not value:
        # Writing message to stderr but returning any potentially empty
        # value to caller as is
        log.err.write('(unset)')
    except properties.InvalidValueError as e:
      # Writing warning to stderr but returning invalid value as is
      log.warn(str(e))
      value = properties.VALUES.Section(section).Property(prop).Get(
          validate=False)
    return value

  def Format(self, args):
    return 'value(.)'
