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
"""Command for waiting until managed instance group becomes stable."""

from googlecloudsdk.api_lib.compute import base_classes
from googlecloudsdk.api_lib.compute import instance_groups_utils
from googlecloudsdk.api_lib.compute import request_helper
from googlecloudsdk.api_lib.compute import time_utils
from googlecloudsdk.api_lib.compute import utils
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.compute import flags
from googlecloudsdk.command_lib.compute.instance_groups.managed import wait_info
from googlecloudsdk.core import log


def _AddArgs(parser, multizonal):
  """Adds args."""
  parser.add_argument('name',
                      help='Name of the managed instance group.')
  parser.add_argument('--timeout',
                      type=int,
                      help='Timeout in seconds for waiting '
                      'for group becoming stable.')
  if multizonal:
    scope_parser = parser.add_mutually_exclusive_group()
    flags.AddRegionFlag(
        scope_parser,
        resource_type='managed instance group',
        operation_type='wait until stable',
        explanation=flags.REGION_PROPERTY_EXPLANATION_NO_DEFAULT)
    flags.AddZoneFlag(
        scope_parser,
        resource_type='managed instance group',
        operation_type='wait until stable',
        explanation=flags.ZONE_PROPERTY_EXPLANATION_NO_DEFAULT)
  else:
    flags.AddZoneFlag(
        parser,
        resource_type='managed instance group',
        operation_type='wait until stable')


@base.ReleaseTracks(base.ReleaseTrack.GA)
class WaitUntilStable(base_classes.BaseCommand):
  """Waits until state of managed instance group is stable."""

  _TIME_BETWEEN_POLLS_SEC = 10

  @staticmethod
  def Args(parser):
    _AddArgs(parser=parser, multizonal=False)

  @property
  def service(self):
    return self.compute.instanceGroupManagers

  @property
  def resource_type(self):
    return 'instanceGroupManagers'

  def CreateGroupReference(self, args):
    return self.CreateZonalReference(args.name, args.zone)

  def Run(self, args):
    start = time_utils.CurrentTimeSec()
    group_ref = self.CreateGroupReference(args)

    while True:
      responses, errors = self._GetResources(group_ref)
      if errors:
        utils.RaiseToolException(errors)
      if wait_info.IsGroupStable(responses[0]):
        break
      log.out.Print(wait_info.CreateWaitText(responses[0]))
      time_utils.Sleep(WaitUntilStable._TIME_BETWEEN_POLLS_SEC)

      if args.timeout and time_utils.CurrentTimeSec() - start > args.timeout:
        raise utils.TimeoutError('Timeout while waiting for group to become '
                                 'stable.')
    log.out.Print('Group is stable')

  def GetRequestForGroup(self, group_ref):
    service = self.compute.instanceGroupManagers
    request = service.GetRequestType('Get')(
        instanceGroupManager=group_ref.Name(),
        zone=group_ref.zone,
        project=self.project)
    return (service, request)

  def _GetResources(self, group_ref):
    """Retrieves group with pending actions."""
    service, request = self.GetRequestForGroup(group_ref)
    errors = []
    results = list(request_helper.MakeRequests(
        requests=[(service, 'Get', request)],
        http=self.http,
        batch_url=self.batch_url,
        errors=errors,
        custom_get_requests=None))

    return results, errors


@base.ReleaseTracks(base.ReleaseTrack.BETA)
class WaitUntilStableBeta(WaitUntilStable):
  """Waits until state of managed instance group is stable."""

  @staticmethod
  def Args(parser):
    _AddArgs(parser=parser, multizonal=True)

  def CreateGroupReference(self, args):
    return instance_groups_utils.CreateInstanceGroupReference(
        scope_prompter=self, compute=self.compute, resources=self.resources,
        name=args.name, region=args.region, zone=args.zone)

  def GetRequestForGroup(self, group_ref):
    if group_ref.Collection() == 'compute.regionInstanceGroupManagers':
      service = self.compute.regionInstanceGroupManagers
      request = service.GetRequestType('Get')(
          instanceGroupManager=group_ref.Name(),
          region=group_ref.region,
          project=self.project)
    else:
      service = self.compute.instanceGroupManagers
      request = service.GetRequestType('Get')(
          instanceGroupManager=group_ref.Name(),
          zone=group_ref.zone,
          project=self.project)
    return (service, request)


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class WaitUntilStableAlpha(WaitUntilStableBeta):
  """Waits until state of managed instance group is stable."""

  def Run(self, args):
    start = time_utils.CurrentTimeSec()
    group_ref = self.CreateGroupReference(args)

    while True:
      responses, errors = self._GetResources(group_ref)
      if errors:
        utils.RaiseToolException(errors)
      if wait_info.IsGroupStableAlpha(responses[0]):
        break
      log.out.Print(wait_info.CreateWaitTextAlpha(responses[0]))
      time_utils.Sleep(WaitUntilStableAlpha._TIME_BETWEEN_POLLS_SEC)

      if args.timeout and time_utils.CurrentTimeSec() - start > args.timeout:
        raise utils.TimeoutError('Timeout while waiting for group to become '
                                 'stable.')
    log.out.Print('Group is stable')
