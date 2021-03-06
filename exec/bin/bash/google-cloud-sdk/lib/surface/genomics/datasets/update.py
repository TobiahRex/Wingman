# Copyright 2015 Google Inc. All Rights Reserved.
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

"""Implementation of gcloud genomics datasets update.
"""

from googlecloudsdk.api_lib.genomics import genomics_util
from googlecloudsdk.calliope import base
from googlecloudsdk.core import log


class Update(base.Command):
  """Updates a dataset name.
  """

  @staticmethod
  def Args(parser):
    """Register flags for this command."""
    parser.add_argument('id',
                        help='The ID of the dataset to be updated.')
    parser.add_argument('--name',
                        help='The new name of the dataset.',
                        required=True)

  @genomics_util.ReraiseHttpException
  def Run(self, args):
    """This is what gets called when the user runs this command.

    Args:
      args: an argparse namespace, All the arguments that were provided to this
        command invocation.

    Raises:
      HttpException: An http error response was received while executing api
          request.
    Returns:
      None
    """
    apitools_client = genomics_util.GetGenomicsClient()
    genomics_messages = genomics_util.GetGenomicsMessages()

    request = genomics_messages.GenomicsDatasetsPatchRequest(
        dataset=genomics_messages.Dataset(name=args.name,),
        datasetId=args.id,)

    return apitools_client.datasets.Patch(request)

  def Display(self, args, dataset):
    """This method is called to print the result of the Run() method.

    Args:
      args: The arguments that command was run with.
      dataset: The value returned from the Run() method.
    """
    if dataset:
      log.Print('Updated dataset {0}, name: {1}'.format(
          dataset.id, dataset.name))
