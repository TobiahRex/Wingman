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

"""The gcloud app regions group."""
from googlecloudsdk.calliope import base


@base.ReleaseTracks(base.ReleaseTrack.BETA)
class Regions(base.Group):
  """View regional availability of App Engine runtime environments.

  This command can be used to view availability of App Engine standard and
  flexible runtime environments in all geographic regions.
  """

  detailed_help = {
      'DESCRIPTION': '{description}',
      'EXAMPLES': """\
          To view regional availability of App Engine runtime environments, run:

            $ {command} list
      """,
  }
